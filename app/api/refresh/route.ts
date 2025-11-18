// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors } from "jose";
import jwt from "jsonwebtoken";
import { getRedis } from "../redis/redis";


export const runtime = "nodejs";

const ACCESS_EXPIRES_IN = 60 * 15;        // 15 phút
const REFRESH_EXPIRES_IN = 60 * 60 * 24;  // 24 giờ

type AuthPayload = {
    id: string;
    role: string;
    email: string;
    sid: string;
};

export async function POST(req: NextRequest) {
    try {
        const redis = getRedis();

        const refreshToken = req.cookies.get("rftoken")?.value;
        if (!refreshToken) {
            return NextResponse.json(
                { error: "Missing refresh token" },
                { status: 401 }
            );
        }

        if (!process.env.REFRESH_TOKEN_SECRET || !process.env.TOKEN_SECRET) {
            console.error("Missing REFRESH_TOKEN_SECRET or TOKEN_SECRET");
            return NextResponse.json(
                { error: "Server misconfigured" },
                { status: 500 }
            );
        }

        // 1. Verify refresh token
        const refreshSecret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
        const { payload } = await jwtVerify(refreshToken, refreshSecret, {
            algorithms: ["HS256"],
        });

        const { id, role, email, sid } = payload as unknown as AuthPayload;

        if (!id || !sid) {
            return NextResponse.json(
                { error: "Invalid refresh token payload" },
                { status: 401 }
            );
        }

        // 2. Check refresh token có trong Redis không (anti reuse / revoke)
        const key = `refresh:${sid}`;
        const storedRefresh = await redis.get(key);

        if (!storedRefresh || storedRefresh !== refreshToken) {
            // Có thể đã logout, rotate, hoặc token fake
            return NextResponse.json(
                { error: "Refresh token invalid or expired" },
                { status: 401 }
            );
        }

        // 3. (Optional nhưng nên có): rotate sessionId
        //    Tạo sessionId mới, xoá session cũ -> chống reuse refresh token
        const { randomUUID } = await import("crypto");
        const newSid = randomUUID();

        const newPayload: AuthPayload = {
            id,
            role,
            email,
            sid: newSid,
        };

        // 4. Cấp accessToken + refreshToken mới
        const accessToken = jwt.sign(newPayload, process.env.TOKEN_SECRET, {
            expiresIn: "15m",
        });

        const newRefreshToken = jwt.sign(
            newPayload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "24h",
            }
        );

        // 5. Cập nhật Redis:
        //    - Xoá refresh cũ
        //    - Lưu refresh mới
        //    - Update set session của user
        const oldSid = sid;

        const userSessionsKey = `user_sessions:${id}`;
        const newRefreshKey = `refresh:${newSid}`;

        const pipeline = redis.multi();
        pipeline.del(`refresh:${oldSid}`);
        pipeline.set(newRefreshKey, newRefreshToken, "EX", REFRESH_EXPIRES_IN);
        pipeline.srem(userSessionsKey, oldSid);
        pipeline.sadd(userSessionsKey, newSid);
        await pipeline.exec();

        // 6. Set lại cookie
        const res = NextResponse.json({ success: true }, { status: 200 });

        res.cookies.set("token", accessToken, {
            httpOnly: true,
            path: "/",
            maxAge: ACCESS_EXPIRES_IN,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.cookies.set("rftoken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            maxAge: REFRESH_EXPIRES_IN,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res;
    } catch (err: any) {
        console.error("Refresh error:", err);

        if (err instanceof errors.JWTExpired) {
            return NextResponse.json(
                { error: "Refresh token expired" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Invalid refresh token" },
            { status: 401 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import { getRedis } from "../redis/redis";
import { jwtVerify } from "jose";


connect();

type AuthPayload = {
    id: string;
    role: string;
    email: string;
    sid: string;
};

export async function GET(request: NextRequest) {
    try {
        const res = NextResponse.json(
            { message: "Logout done", success: true },
            { status: 200 }
        );

        /// get the hell out of refresh token at cookies

        const redis = getRedis()


        const accessToken = request.cookies.get("token")?.value;
        if (!accessToken) {
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
        const Secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
        const { payload } = await jwtVerify(accessToken, Secret, {
            algorithms: ["HS256"],
        });

        const { id, role, email, sid } = payload as unknown as AuthPayload;
        const refreshKey = `refresh:${sid}`;
        const userSessionsKey = `user_sessions:${id}`;

        await redis.del(refreshKey)
        await redis.srem(userSessionsKey, sid)

        ///// get the hell out of token* in cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "strict" as const,
            path: "/",
        };
        res.cookies.set("token", "", { ...cookieOptions, expires: new Date(0) });
        res.cookies.set("rftoken", "", { ...cookieOptions, expires: new Date(0) });

        return res;
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getRedis } from "../redis/redis";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const redis = getRedis();
const expiresIn = 60 * 15;        // 15 phút
const RfexpiresIn = 24 * 60 * 60; // 24 giờ

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = body?.email;
        const password = body?.password;

        if (!email || !password) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 });
        }

        // Dọn session rác
        const userSessionsKey = `user_sessions:${user._id}`;
        const sessions = await redis.smembers(userSessionsKey);

        for (const sid of sessions) {
            const exists = await redis.exists(`refresh:${sid}`);
            if (!exists) {
                await redis.srem(userSessionsKey, sid); // xoá sid rác
            }
        }

        // Tạo session mới
        const sessionId = randomUUID();

        const tokenPayload = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            sid: sessionId,
        };

        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, { expiresIn: "15m" });
        const rftoken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "24h" });

        const res = NextResponse.json({ message: "login done", success: true });

        // Cookies
        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
        };

        res.cookies.set("token", token, { ...cookieOptions, maxAge: expiresIn });
        res.cookies.set("rftoken", rftoken, { ...cookieOptions, maxAge: RfexpiresIn });

        // Lưu refresh token
        await redis.set(`refresh:${sessionId}`, rftoken, "EX", RfexpiresIn);
        await redis.sadd(userSessionsKey, sessionId);

        return res;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

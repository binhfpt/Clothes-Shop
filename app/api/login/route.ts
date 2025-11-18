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

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json(
                { message: "invalid email or password" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return NextResponse.json(
                { message: "invalid email or password" },
                { status: 400 }
            );
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return NextResponse.json(
                { message: "invalid email or password" },
                { status: 400 }
            );
        }

        if (!process.env.TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            console.error("Missing TOKEN_SECRET or REFRESH_TOKEN_SECRET");
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        //  mỗi login = 1 session mới
        const sessionId = randomUUID();

        const tokenPayload = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            sid: sessionId, // thêm sessionId vào payload
        };

        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, { expiresIn: "15m" });
        const rftoken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });

        const res = NextResponse.json(
            { message: "login done", success: true },
            { status: 200 }
        );

        // cookies
        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: expiresIn,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.cookies.set("rftoken", rftoken, {
            httpOnly: true,
            path: "/",
            maxAge: RfexpiresIn,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        //  Redis – lưu theo sessionId, không phải userId nữa
        const refreshKey = `refresh:${sessionId}`;               // 1 key / session
        const userSessionsKey = `user_sessions:${user._id}`;     // set chứa nhiều sid

        await redis.set(refreshKey, rftoken, "EX", RfexpiresIn); // lưu refresh token
        await redis.sadd(userSessionsKey, sessionId);            // add session vào set user

        return res;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

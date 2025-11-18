// lib/auth.ts
import { jwtVerify, errors } from "jose";
import { NextRequest } from "next/server";
import { getRedis } from "./redis";

export class AuthError extends Error {
    status = 401;
    constructor(message = "Unauthorized") {
        super(message);
    }
}

export async function requireUser(req: NextRequest) {
    const accessToken = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!accessToken) {
        throw new AuthError("Missing access token");
    }

    try {
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
        const { payload } = await jwtVerify(accessToken, secret, {
            algorithms: ["HS256"],
        });
        const userSessionId = payload.sid
        const redis = getRedis();

        // kiem tra accesstoken 
        const accessTokenExists = await redis.sismember(`user_sessions:${payload.id}`, userSessionId as string);
        if (!accessTokenExists)
            throw new AuthError("Token expired");
        // Redis blacklist
        const isBlacklisted = await redis.get(`blacklist:${payload.id}`);
        if (isBlacklisted) {
            throw new AuthError("Token revoked");
        }
        return payload;

    } catch (err: any) {

        if (err instanceof errors.JWTExpired) {
            throw new AuthError("Token expired");
        }

        throw new AuthError("Invalid or expired token");
    }
}

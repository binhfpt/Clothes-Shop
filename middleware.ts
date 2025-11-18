// middleware.ts
import { NextResponse, NextRequest } from "next/server"
import { jwtVerify } from "jose"
// import Redis from "ioredis"

// const local_redis = new Redis(
//     {
//         host: "127.0.0.1",
//         port: 6379,
//     }
// )
const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/api/public",
]

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const token = request.cookies.get("token")?.value
    if (!token) {
        url.pathname = "/login"
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
    try {
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!)
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] })
        if (!payload) return NextResponse.redirect("/login")
        if (payload.role === "admin") {
            url.pathname = "/admin"
            return NextResponse.redirect(url)
        }
        // const redisToken = await local_redis.get(`access:${payload.id}`)
        // if (!redisToken) {
        //     // Token đã bị revoke hoặc hết hạn TTL từ Redis
        //     const res = NextResponse.redirect("/login")
        //     res.cookies.delete("token")
        //     return res
        // }
        // if (redisToken !== token) {
        //     const res = NextResponse.redirect("/login")
        //     res.cookies.delete("token")
        //     return res
        // }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(payload.id));
        requestHeaders.set("x-user-email", String(payload.email));
        requestHeaders.set("x-user-role", String(payload.role ?? ""));
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch {
        // Sai chữ ký / hết hạn -> về login + xoá cookie
        url.pathname = "/login"
        url.searchParams.set("from", request.nextUrl.pathname)
        const res = NextResponse.redirect(url)
        res.cookies.delete("token")
        return res
    }
}

export const config = {
    matcher: [
        "/home"
    ],
}
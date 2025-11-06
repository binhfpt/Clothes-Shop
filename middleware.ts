// middleware.ts
import { NextResponse, NextRequest } from "next/server"
import { jwtVerify } from "jose"

const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/api/public",
]

const isPublicPath = (pathname: string) => {
    // "/" phải check exact, vì mọi path đều bắt đầu bằng "/"
    if (pathname === "/") return true

    return publicPaths.some((path) => {
        if (path === "/") return false
        return pathname.startsWith(path)
    })
}


export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const token = request.cookies.get("token")?.value

    if (!token) {
        url.pathname = "/login"
        url.searchParams.set("from", request.nextUrl.pathname)
        return NextResponse.redirect(url)
    }

    try {
        // Verify HS256 với secret
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!)
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] })

        // (tuỳ) kiểm tra thêm claim (role/scope/iss/aud)
        if (payload.role === "admin") {
            url.pathname = "/admin"
            return NextResponse.redirect(url)
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(payload.id));      // chú ý: id, không phải _id
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
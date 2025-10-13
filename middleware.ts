// middleware.ts
import { NextResponse, NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone()
    const token = request.cookies.get("token")?.value

    // Không có token -> login
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
        if (payload.role !== "admin") {
            url.pathname = "/admin"
            return NextResponse.redirect(url)
        }

        // Hợp lệ -> cho đi tiếp

        return NextResponse.next()
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
    matcher: ["/home",],
}

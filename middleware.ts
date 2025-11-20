import { NextResponse, NextRequest } from "next/server"
import { jwtVerify } from "jose"

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

    // ---- Cho phép route công khai ----
    if (publicPaths.some((p) => url.pathname.startsWith(p))) {
        return NextResponse.next()
    }

    // ---- TH1: Có access token -> verify ----
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!)
            const { payload } = await jwtVerify(token, secret)

            const requestHeaders = new Headers(request.headers)
            requestHeaders.set("x-user-id", String(payload.id))
            requestHeaders.set("x-user-email", String(payload.email))
            requestHeaders.set("x-user-role", String(payload.role ?? ""))

            return NextResponse.next({ request: { headers: requestHeaders } })
        } catch {
            // Token hết hạn -> chuyển sang refresh
        }
    }

    // ---- TH2: Không có access token -> Sang login để refresh ----
    url.pathname = "/login"
    url.searchParams.set("from", request.nextUrl.pathname)
    url.searchParams.set("refresh", "1")    // báo login tự refresh
    return NextResponse.redirect(url)
}

export const config = {
    matcher: ["/home", "/"],
}

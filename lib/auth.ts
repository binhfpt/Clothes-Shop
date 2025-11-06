import { jwtVerify } from "jose";

export async function verifyToken(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!)
        const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] })
        return payload
    } catch (err) {
        return null;
    }
}

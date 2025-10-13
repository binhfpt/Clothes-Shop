import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        const checkUserExist = await User.findOne({ email })
        if (!checkUserExist) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 })
        }
        const checkPassword = await bcrypt.compare(password, checkUserExist.password)
        if (!checkPassword) {
            return NextResponse.json({ message: "invalid email or password" }, { status: 400 })
        }
        const tokenPayload = {
            id: checkUserExist._id,
            username: checkUserExist.username,
            email: checkUserExist.email
        }

        const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, { expiresIn: '1h' })
        const res = NextResponse.json({ message: "login done", success: true }, { status: 200 })
        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
        })
        return res
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json()

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 })
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()
        return NextResponse.json({ message: "VERIFIED" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

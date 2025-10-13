import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connect()

export async function GET(request: NextRequest) {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
        if (!users) {
            return NextResponse.json({ message: "Have no one here" }, { status: 400 })
        }
        const res = NextResponse.json({ users, success: true }, { status: 200 })

        return res
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
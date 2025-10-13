import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import GetDataFromToken from "@/app/helpers/getDataFromToken";

connect()

export async function GET(request: NextRequest) {
    try {
        const id = await GetDataFromToken(request)
        console.log("ID from token:", id)
        const user = await User.findById(id)
        console.log("User found:", user)

        return NextResponse.json({ user }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
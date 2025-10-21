import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import Brand from "@/app/models/brand"
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import Category from "@/app/models/category";

connect()

export async function GET(request: NextRequest) {
    try {
        const categories = await Category.find({ parent: null })
        if (!categories) {
            return NextResponse.json({ message: "Have no category here" }, { status: 400 })
        }
        const res = NextResponse.json({ categories, success: true }, { status: 200 })

        return res
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
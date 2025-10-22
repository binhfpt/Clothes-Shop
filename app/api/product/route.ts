import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import Brand from "@/app/models/brand"
import Product from "@/app/models/product"
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connect()

export async function GET(request: NextRequest) {
    try {
        const products = await Product.find()
        if (!products) {
            return NextResponse.json({ message: "Have no product here" }, { status: 400 })
        }
        const res = NextResponse.json({ products, success: true }, { status: 200 })

        return res
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
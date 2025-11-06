import { connect } from "@/app/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import blog from "@/app/models/blog";

connect()

export async function GET(request: NextRequest) {
    try {
        const blogs = await blog.find()
        if (!blogs) {
            return NextResponse.json({ message: "Have no blog here" }, { status: 400 })
        }
        const res = NextResponse.json({ blogs, success: true }, { status: 200 })

        return res
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
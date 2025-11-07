// app/api/blog/route.ts
import { connect } from "@/app/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/user";

import Blog from "@/app/models/blog";

connect();

export async function GET(request: NextRequest) {
    try {
        const blogs = await Blog.find().populate("author", "username email avatar");

        if (!blogs || blogs.length === 0) {
            return NextResponse.json({ message: "Have no blog here" }, { status: 400 });
        }

        return NextResponse.json({ blogs, success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

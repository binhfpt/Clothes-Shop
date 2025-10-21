import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import Category from "@/app/models/category"; // model JS bạn đưa ở trên dùng OK trong TS

// Nếu bạn muốn chạy trên edge, bỏ comment dòng dưới
// export const runtime = "nodejs";
connect();

export async function POST(req: NextRequest) {
    try {
        const { name, slug, description, parent } = await req.json();
        // TODO: validate name , logo
        if (!name || name.length === 0) {
            return NextResponse.json({ message: "No Name here holly hell?" }, { status: 400 })
        }
        //
        const check = await Category.findOne({ slug })
        if (check) {
            return NextResponse.json({ message: "Already have this brand" }, { status: 409 })
        }

        const newCate = new Category({
            name: name,
            slug: slug,
            description: description,
            parent: parent || null,
            isActive: true
        })
        const savedCate = await newCate.save()

        //TODO: res
        return NextResponse.json(
            { message: "Brand created successfully", category: savedCate },
            { status: 201 }
        );

    } catch (err: any) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

import { connect } from "@/app/dbConfig/dbConfig";
import Category from "@/app/models/category";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const category = await Category.find({ slug: slug });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ category, success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { connect } from "@/app/dbConfig/dbConfig";
import Category from "@/app/models/category";
import { NextRequest, NextResponse } from "next/server";

connect();

// GET /api/get/categories/[slug]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const categories = await Category.find({ parent: id });

        if (!categories) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ categories, success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

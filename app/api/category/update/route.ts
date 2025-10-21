import { connect } from "@/app/dbConfig/dbConfig";
import Category from "@/app/models/category";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PATCH(request: NextRequest) {
    try {
        const { form, cateid } = await request.json()

        const category = await Category.findByIdAndUpdate(cateid, {
            $set: { ...form }
        }, { new: true });

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

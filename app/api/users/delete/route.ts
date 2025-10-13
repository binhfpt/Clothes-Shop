import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(request: NextRequest) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "Missing or invalid user IDs" }, { status: 400 });
        }

        const result = await User.deleteMany({ _id: { $in: ids } });

        // 🧾 Kiểm tra xem có user nào bị xóa không
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "No users found to delete" }, { status: 404 });
        }

        return NextResponse.json({
            message: `Deleted ${result.deletedCount} user(s) successfully`,
            success: true,
            deletedCount: result.deletedCount
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

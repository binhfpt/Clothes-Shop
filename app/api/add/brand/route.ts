import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import Brand from "@/app/models/brand"; // model JS bạn đưa ở trên dùng OK trong TS

// Nếu bạn muốn chạy trên edge, bỏ comment dòng dưới
// export const runtime = "nodejs";
connect();

const getSlug = (name: string): string => {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")     // thay khoảng trắng bằng dấu -
        .replace(/[^\w\-]+/g, ""); // loại bỏ ký tự đặc biệt
};

export async function POST(req: NextRequest) {
    try {
        const { name, logo } = await req.json();
        // TODO: validate name , logo
        if (!name || name.length === 0) {
            return NextResponse.json({ message: "No Name here holly hell?" }, { status: 400 })
        }
        //

        const slug = getSlug(name);

        const checkBrand = await Brand.findOne({ slug })
        if (checkBrand) {
            return NextResponse.json({ message: "Already have this brand" }, { status: 409 })
        }

        const newBrand = new Brand({
            name: name,
            slug: slug,
            logo: logo || "image.png",
            isActive: true
        })
        const savedBrand = await newBrand.save()

        //TODO: res
        return NextResponse.json(
            { message: "Brand created successfully", brand: savedBrand },
            { status: 201 }
        );

    } catch (err: any) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

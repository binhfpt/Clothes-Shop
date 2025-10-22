import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import Brand from "@/app/models/brand"; // model JS bạn đưa ở trên dùng OK trong TS
import Product from "@/app/models/product"
import product from "@/app/models/product";
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
const getSku = (name: string, color: string, size: string): string => {

    var skuRaw = name + " " + color + " " + size

    return skuRaw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")     // thay khoảng trắng bằng dấu -
        .replace(/[^\w\-]+/g, ""); // loại bỏ ký tự đặc biệt
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.title || !body.description || !body.category) {
            return NextResponse.json(
                { error: "Thiếu thông tin bắt buộc" },
                { status: 400 }
            );
        }

        if (body.variants?.length > 0) {
            const skuSet = new Set(body.variants.map((v: any) => getSku(body.title, v.color, v.size)));
            if (skuSet.size !== body.variants.length) {
                return NextResponse.json(
                    { error: "Các SKU trong variants bị trùng nhau" },
                    { status: 400 }
                );
            }
        }

        const slug = getSlug(body.title);

        const checkProduct = await Product.findOne({ slug })
        if (checkProduct) {
            return NextResponse.json(
                { message: "Already have this product" },
                { status: 409 }
            )
        }

        const finalVariants = body.variants.map((v: any) => ({
            ...v,
            sku: getSku(body.title, v.color, v.size)
        }));

        const newProduct = await Product.create({
            title: body.title,
            slug: slug,
            description: body.description,
            brand: body.brand || null,
            category: body.category,
            categories: body.categories || [],
            images: body.images,
            variants: finalVariants || [],
            price: Number(body.price),
            sold: 0,
            discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
            stock: Number(body.stock),
            isActive: body.isActive ?? true,
            isNew: body.isNew ?? false,
            seoTitle: body.seoTitle || "",
            seoDescription: body.seoDescription || "",
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product: newProduct
            },
            { status: 201 }
        );

    } catch (err: any) {
        console.error("Create product error:", err)
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        )
    }
}
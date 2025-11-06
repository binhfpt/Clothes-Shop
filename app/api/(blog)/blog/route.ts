import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import blog from "@/app/models/blog"; // model JS bạn đưa ở trên dùng OK trong TS
import { verifyToken } from "@/lib/auth";

connect();
const estimateReadingTime = (content: string): number => {
    // Nếu content là HTML từ TipTap, loại bỏ tag trước
    const text = content
        .replace(/<[^>]+>/g, " ")   // bỏ tag HTML
        .replace(/\s+/g, " ")       // gom nhiều space thành 1
        .trim();

    if (!text) return 1;

    const words = text.split(" ").length;
    const WORDS_PER_MINUTE = 200;

    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

const getSlug = (name: string): string => {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")     // thay khoảng trắng bằng dấu -
        .replace(/[^\w\-]+/g, ""); // loại bỏ ký tự đặc biệt
};

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        // Lấy thông tin user
        const author = payload.id
        const { content, form, imgUrl, type } = await req.json();
        if (!form.title || form.title.length === 0) {
            return NextResponse.json({ message: "No Name here holly hell?" }, { status: 400 })
        }
        if (!form.tag || form.tag.length === 0) {
            return NextResponse.json({ message: "No Name here holly hell?" }, { status: 400 })
        }
        //

        //// TODO slug = tilte + something here for unique
        const slug = getSlug(form.title);

        const checkBlog = await blog.findOne({ slug })
        if (checkBlog) {
            return NextResponse.json({ message: "Already have this brand" }, { status: 409 })
        }

        let publishDate: Date | null = null;
        if (type === "published") {
            publishDate = new Date();
        }

        const readingTime = estimateReadingTime(content);

        const newBlog = new blog({
            author: author,
            slug: slug,
            title: form.title,
            subTitle: form.description,
            content,
            thumbnail: imgUrl,
            status: type,
            tag: form.tag,
            publishDate,
            seo: {
                metaTitle: form.metaTitle ?? form.title,
                metaDescription: form.metaDescription ?? form.description ?? ""
            },
            readingTime,
            viewers: []


        })
        const savedBlog = await newBlog.save()

        //TODO: res
        return NextResponse.json(
            { message: "Brand created successfully", blog: savedBlog },
            { status: 201 }
        );

    } catch (err: any) {
        return NextResponse.json({ err }, { status: 500 })
    }
}

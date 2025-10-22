// models/product.js
import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
    {
        sku: { type: String, required: true, trim: true },
        color: { type: String, trim: true },         // mã màu hoặc text ("#fff", "Red")
        size: { type: String, trim: true },          // S, M, L, XL...
        stock: { type: Number, required: true, min: 0, default: 0 },
        price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, min: 0 }      // nếu null -> dùng price hoặc campaign
    },
    { _id: false }
);
VariantSchema.index({ sku: 1 }, { unique: true });

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "pls provide title"], trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: [true, "pls provide description"] },

        // Gắn brand & categories
        brand: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],

        // Hình ảnh
        images: { type: [String], required: true, validate: v => Array.isArray(v) && v.length > 0 },

        // Biến thể
        variants: { type: [VariantSchema], default: [] },

        // Giá mặc định nếu SP không có variant (hoặc để hiển thị nhanh)
        price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, min: 0 },

        // Tổng tồn kho (có thể tính từ variants)
        stock: { type: Number, required: true, min: 0 },

        // Trạng thái
        isActive: { type: Boolean, default: true },
        isNew: { type: Boolean, default: false },

        // SEO
        seoTitle: { type: String },
        seoDescription: { type: String },
        sold: { type: Number },
        // Rating tổng hợp (điền bởi middleware/cron từ Review)
        ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
        ratingCount: { type: Number, default: 0, min: 0 }
    },
    { timestamps: true }
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ "variants.sku": 1 });

export default mongoose.models.Product || mongoose.model("product", ProductSchema);

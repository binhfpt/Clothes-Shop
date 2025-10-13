// models/voucher.js
import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, uppercase: true, trim: true, unique: true },
        voucherType: { type: String, enum: ["ORDER", "SHIP"] },
        type: { type: String, enum: ["PERCENT", "FIXED"], required: true },
        value: { type: Number, required: true, min: 0 }, // % hoặc số tiền
        maxDiscount: { type: Number, min: 0 },           // trần giảm nếu type=PERCENT

        minOrderValue: { type: Number, min: 0, default: 0 },
        usageLimit: { type: Number, min: 0 },            // tổng số lần toàn hệ thống (null=∞)
        perUserLimit: { type: Number, min: 0 },          // mỗi user (null=∞)
        usedCount: { type: Number, default: 0, min: 0 },

        startsAt: { type: Date },
        endsAt: { type: Date },

        // phạm vi áp dụng
        applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
        applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
        applicableBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "brand" }],

        // stackable: { type: Boolean, default: false }, // có cho phép cộng dồn không
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

VoucherSchema.index({ code: 1 }, { unique: true });
VoucherSchema.index({ startsAt: 1, endsAt: 1, isActive: 1 });

export default mongoose.models.Voucher || mongoose.model("voucher", VoucherSchema);

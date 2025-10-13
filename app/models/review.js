// models/review.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, trim: true },
        content: { type: String, trim: true },
        images: [String],
        isApproved: { type: Boolean, default: true } // moderation
    },
    { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model("review", ReviewSchema);

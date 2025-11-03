// models/category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String },
        amount: { type: Number, default: 0 },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "category", default: null },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

CategorySchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model("category", CategorySchema);

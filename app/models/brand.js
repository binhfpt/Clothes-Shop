// models/brand.js
import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        // description
        slug: { type: String, required: true, unique: true, lowercase: true },
        logo: { type: String },
        isActive: { type: Boolean, default: true },
        amount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

BrandSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Brand || mongoose.model("brand", BrandSchema);

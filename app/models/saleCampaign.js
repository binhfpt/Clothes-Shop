// models/saleCampaign.js
import mongoose from "mongoose";

const SaleCampaignSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        type: { type: String, enum: ["PERCENT", "FIXED"], required: true },
        value: { type: Number, required: true, min: 0 },
        maxDiscount: { type: Number, min: 0 },

        startsAt: { type: Date, required: true },
        endsAt: { type: Date, required: true },
        isActive: { type: Boolean, default: true },

        applyToAll: { type: Boolean, default: false },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
        brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "brand" }]
    },
    { timestamps: true }
);

SaleCampaignSchema.index({ slug: 1 }, { unique: true });
SaleCampaignSchema.index({ startsAt: 1, endsAt: 1, isActive: 1 });

export default mongoose.models.SaleCampaign || mongoose.model("salecampaign", SaleCampaignSchema);

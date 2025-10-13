// models/shippingMethod.js
import mongoose from "mongoose";

const RateSchema = new mongoose.Schema(
    {
        regionCode: { type: String, required: true }, // VN-HN, VN-HCM, US-CA...
        minWeight: { type: Number, required: true, min: 0 }, // kg
        maxWeight: { type: Number, required: true, min: 0 },
        baseFee: { type: Number, required: true, min: 0 },
        feePerKg: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const ShippingMethodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        carrier: { type: String, trim: true }, // GHN/GHTK/VNPost...
        isActive: { type: Boolean, default: true },
        rates: { type: [RateSchema], default: [] },
        etaDaysMin: { type: Number, min: 0 },
        etaDaysMax: { type: Number, min: 0 }
    },
    { timestamps: true }
);

ShippingMethodSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.ShippingMethod || mongoose.model("shippingmethod", ShippingMethodSchema);

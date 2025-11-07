// models/order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        variantSku: { type: String }, // để xác định biến thể chính xác
        title: { type: String, required: true },      // snapshot
        image: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },          // đơn giá gốc
        discount: { type: Number, default: 0, min: 0 },           // tổng giảm trên item
        lineTotal: { type: Number, required: true, min: 0 }       // (price - discount) * qty
    },
    { _id: false }
);

const AddressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, required: true }
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: { type: [OrderItemSchema], required: true },
        subtotal: { type: Number, required: true, min: 0 },
        shippingMethod: { type: mongoose.Schema.Types.ObjectId, ref: "shippingmethod" },
        shippingFee: { type: Number, required: true, min: 0, default: 0 },

        orderVoucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
        shippingVoucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
        voucherCodeSnapshot: { type: String }, // lưu phòng khi voucher bị xóa/đổi
        discountTotal: { type: Number, required: true, min: 0, default: 0 },

        total: { type: Number, required: true, min: 0 },

        shippingAddress: { type: AddressSchema, required: true },
        note: { type: String },

        status: {
            type: String,
            enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
            default: "PENDING"
        },

        payment: {
            provider: { type: String }, // COD/VNPAY/MoMo/Stripe/PayPal...
            transactionId: { type: String },
            paidAt: { type: Date }
        }
    },
    { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model("order", OrderSchema);

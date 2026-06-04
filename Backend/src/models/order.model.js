import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'variant',
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    razorpay: {
        orderId: { type: String, required: true },
        paymentId: { type: String },
        signature: { type: String }
    }
}, { timestamps: true });

export default mongoose.model("order", orderSchema);

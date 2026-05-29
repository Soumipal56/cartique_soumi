import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        amount: {
            type: Number,
            // amount is optional; default to 0 if not provided
            default: 0
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR"
        }
    },

    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {
            images: {
                type: [{
                    url: {
                        type: String,
                        required: true
                    }
                }],
                validate: {
                    validator: function (v) {
                        return v.length <= 7;
                    },
                    message: props => `Maximum 7 images allowed per variant, got ${props.value.length}`
                }
            },
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String,
                // Ensure at least one attribute is present for the variant
                validate: {
                    validator: function (v) {
                        return v && v.size > 0;
                    },
                    message: 'At least one attribute is required for each variant.'
                }
            },
            price: {
                amount: {
                    type: Number,
                    // amount optional; default 0
                    default: 0
                },
                currency: {
                    type: String,
                    enum: ["USD", "EUR", "GBP", "JPY", "INR"],
                    default: "INR"
                }
            }
        }
    ] 
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
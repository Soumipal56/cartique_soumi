import mongoose from "mongoose";
import priceSchema from "./price.schema.js"

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
        type: priceSchema,
        required: true
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
                required: true,
                min: 0,
                // Stock must be provided and non-negative
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
                type: priceSchema
            },
            ratings: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "user",
                        required: true
                    },
                    score: {
                        type: Number,
                        required: true,
                        min: 0,
                        max: 10
                    }
                }
            ]
        }
    ] 
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res, next) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user;

        // Verify if req.files exists
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required", success: false });
        }

        const images = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))

        const product = await productModel.create({
            title,
            description,
            price:{
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        res.status(201).json({ message: "Product created successfully", success: true, product })
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product", error: error.message, success: false });
    }
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ 
        seller: seller._id 
    });

    res.status(200).json({ 
        message: "Products fetched successfully", 
        success: true, 
        products 
    });
}


    
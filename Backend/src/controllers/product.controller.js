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
                amount: priceAmount ? Number(priceAmount) : 0,
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

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find().populate("seller", "name email");
        res.status(200).json({ 
            message: "All products fetched successfully", 
            success: true, 
            products 
        });
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message, success: false });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).populate("seller", "name email");
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Failed to fetch product", error: error.message, success: false });
    }
}

export async function addProductVariant(req, res){

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    const files = req.files;
    const images = [];
    if (files && files.length > 0) {
        (await Promise.all(files.map(async (file) => {
            const image = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
            return image;
        }))).forEach(img => images.push(img));
    }

    const priceAmount = req.body.priceAmount;
    const price = (priceAmount !== undefined && priceAmount !== "null" && priceAmount !== "") ? Number(priceAmount) : undefined;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || "{}");
    // Ensure attributes is an object (not an array) before proceeding
    if (typeof attributes !== 'object' || Array.isArray(attributes)) {
        return res.status(400).json({ message: "Attributes must be an object", success: false });
    }
    // Add the new variant to the product
    product.variants.push({
        images,
        attributes,
        stock: Number(stock),
        price: { amount: Number(price) || 0, currency: req.body.priceCurrency || product.price.currency }
    });

    await product.save();

    res.status(201).json({
        message: "Variant added successfully",
        success: true,
        variant: product.variants[product.variants.length - 1]
    });
}

// Exported above with function declaration

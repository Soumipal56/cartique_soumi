import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";
import { getSellerProducts, getAllProducts, getProductById, addProductVariant, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

const router = Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 */
router.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct)

/**
 * @route GET /api/products/seller
 * @desc Get products of the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProducts)

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get("/", getAllProducts)

/**
 * @route GET /api/products/:id
 * @desc Get a single product by ID
 * @access Public
 */
router.get("/:id", getProductById)



/**
 * @route PUT /api/products/:id
 * @desc Update a product
 * @access Private (Seller only)
 */
router.put("/:id", authenticateSeller, upload.array("images", 7), updateProduct)

/**
 * @route DELETE /api/products/:id
 * @desc Delete a product
 * @access Private (Seller only)
 */
router.delete("/:id", authenticateSeller, deleteProduct)

/**
 * @route post /api/products/:productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant)

export default router;
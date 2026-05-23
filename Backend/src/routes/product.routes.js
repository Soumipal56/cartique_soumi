import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

const router = Router();

router.post("/", authenticateSeller, upload.array("image", 7), createProduct)

export default router;
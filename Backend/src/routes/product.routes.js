import { Router } from "express";
import { authentucateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

router.post("/", authentucateSeller, createProduct)

export default router;
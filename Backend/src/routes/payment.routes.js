import express from "express";
import { createPaymentOrder } from "../controllers/payment.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", authenticateUser, createPaymentOrder);

export default router;

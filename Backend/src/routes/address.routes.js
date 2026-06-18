import express from "express";
import { addAddress, getUserAddresses } from "../controllers/address.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, addAddress);
router.get("/", authenticateUser, getUserAddresses);

export default router;

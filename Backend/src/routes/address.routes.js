import express from "express";
import { addAddress, getUserAddresses } from "../controllers/address.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuth, addAddress);
router.get("/", isAuth, getUserAddresses);

export default router;

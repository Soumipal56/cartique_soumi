import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart, validateUpdateCart, validateRemoveFromCart } from "../validator/cart.validator.js";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cart.controller.js";


const router = express.Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variat to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)

router.put("/update/:productId/:variantId", authenticateUser, validateUpdateCart, updateCartItem)
router.delete("/remove/:productId/:variantId", authenticateUser, validateRemoveFromCart, removeFromCart)

router.get("/", authenticateUser, getCart)

export default router;

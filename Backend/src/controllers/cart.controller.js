import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const cart =
    (await cartModel.findOneAndUpdate({
      user: req.user._id,
    })) ||
    (await cartModel.create({
      user: req.user._id,
    }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock and you already have ${quantityInCart} in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      {
        $inc: {
          "items.$.quantity": quantity,
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: "Quantity updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.price,
  });

  await cart.save();

  return res.status(200).json({
    message: "Item added to cart successfully",
    success: true,
  });
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be at least 1", success: false });
    }
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product or variant not found", success: false });
    }
    const stock = await stockOfVariant(productId, variantId);
    if (quantity > stock) {
      return res
        .status(400)
        .json({ message: `Only ${stock} items left in stock`, success: false });
    }
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }
    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.variant?.toString() === variantId,
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not in cart", success: false });
    }
    item.quantity = quantity;
    await cart.save();
    return res
      .status(200)
      .json({ message: "Quantity updated", success: true, item });
  } catch (err) {
    console.error("Error updating cart item:", err);
    return res
      .status(500)
      .json({ message: "Failed to update cart", error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = req.user;
    let cart = await cartModel.aggregate(
      [
        {
          $match: {
            user: new mongoose.Types.ObjectId(user._id),
          },
        },
        { $unwind: { path: "$items" } },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "items.product",
          },
        },
        { $unwind: { path: "$items.product" } },
        {
          $unwind: { path: "$items.product.variants" },
        },
        {
          $match: {
            $expr: {
              $eq: ["$items.variant", "$items.product.variants._id"],
            },
          },
        },
        {
          $addFields: {
            itemPrice: {
              price: {
                $multiply: [
                  "$items.quantity",
                  "$items.product.variants.price.amount",
                ],
              },
              currency: "$items.product.variants.price.currency",
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            totalPrice: { $sum: "$itemPrice.price" },
            currency: {
              $first: "$itemPrice.currency",
            },
            items: { $push: "$items" },
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    );

    if (!cart) {
      cart = await cartModel.create({ user: user._id });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({
      message: "Failed to fetch cart",
      error: err.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          i.variant?.toString() === variantId
        ),
    );
    await cart.save();

    return res
      .status(200)
      .json({ message: "Item removed from cart", success: true });
  } catch (err) {
    console.error("Error removing cart item:", err);
    return res
      .status(500)
      .json({ message: "Failed to remove from cart", error: err.message });
  }
};

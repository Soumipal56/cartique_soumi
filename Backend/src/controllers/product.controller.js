import productModel from "../models/product.model.js";

export async function createProduct(req, res) {
    const { title, description, price } = req.body;
    const seller = req.user;
}


    
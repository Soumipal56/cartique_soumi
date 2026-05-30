import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true,
});

export async function addToCart(productId, variantId, quantity = 1) {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity });
    return response.data;
}

export async function getCart() {
    const response = await cartApiInstance.get("/");
    return response.data;
}

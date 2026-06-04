import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "http://localhost:3000/api/cart",
    withCredentials: true,
});

export async function addToCart(productId, variantId, quantity = 1) {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity });
    return response.data;
}

export async function updateCartItem(productId, variantId, quantity) {
  const response = await cartApiInstance.put(`/update/${productId}/${variantId}`, { quantity });
  return response.data;
}

export async function removeFromCart(productId, variantId) {
  const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`);
  return response.data;
}

export const createCartOrder = async (amount, currency, addressId) => {
  const response = await cartApiInstance.post("/payment/create/order", { amount, currency, addressId });
  return response.data;
}

export async function getCart() {
  const response = await cartApiInstance.get("/");
  return response.data;
}

export const verifyCartOrder = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const response = await cartApiInstance.post("/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  });
  return response.data;
}

export const failCartOrder = async (razorpay_order_id) => {
  const response = await cartApiInstance.post("/payment/fail/order", {
    razorpay_order_id
  });
  return response.data;
}


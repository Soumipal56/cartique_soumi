import { createOrder } from "../services/payment.service.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required", success: false });
    }
    const order = await createOrder({ amount, currency: currency || "INR" });
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Error creating payment order:", err);
    return res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

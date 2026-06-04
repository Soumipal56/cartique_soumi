import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createOrder = async ({ amount, currency = "INR" }) => {
  // Razorpay test mode has a maximum limit of ₹5,00,000 (50000000 paise)
  const cappedAmount = Math.min(amount, 500000);
  const options = {
    amount: Math.round(cappedAmount * 100),
    currency,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

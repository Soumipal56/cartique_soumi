import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCart } from "../hook/useCart";
import { useRazorpay } from "react-razorpay";
import axios from "axios";

const Cart = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCart, handleUpdateQuantity, handleRemoveItem } = useCart();
  const { error, isLoading, Razorpay } = useRazorpay();

  useEffect(() => {
    handleGetCart();
  }, []);

  const handlePayment = async () => {
    try {
      const amount = calculateTotal();
      if (amount <= 0) return;
      const currency = getCartCurrency();
      
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        { amount, currency },
        { withCredentials: true }
      );

      if (!data.success) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Sw0W3Hz59SyCCC", // Fallback to user's hardcoded key
        amount: data.order.amount, 
        currency: data.order.currency,
        name: "Cartique",
        description: "Cart Payment",
        image: "/logo.png",
        order_id: data.order.id, 
        handler: (response) => {
          console.log(response);
          alert("Payment Successful!");
        },
        prefill: {
          name: user?.fullname || "John Doe",
          email: user?.email || "john.doe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment failed!");
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
    }
  };

  const formatPrice = (price) => {
    if (!price || price.amount == null || isNaN(price.amount)) return "";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    const symbol = symbols[price.currency] || price.currency + " ";
    return `${symbol}${Number(price.amount).toLocaleString()}`;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const variant = Array.isArray(item.product?.variants)
        ? item.product.variants.find((v) => v._id === item.variant)
        : item.product?.variants;
      const price = variant?.price?.amount || item.price?.amount || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCurrency = () => {
    if (!cartItems || cartItems.length === 0) return "USD";
    const firstItem = cartItems[0];
    const variant = Array.isArray(firstItem.product?.variants)
      ? firstItem.product.variants.find((v) => v._id === firstItem.variant)
      : firstItem.product?.variants;
    return variant?.price?.currency || firstItem.price?.currency || "USD";
  };

  return (
    <div className="min-h-screen bg-surface-dim font-sans text-on-surface selection:bg-primary/20 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-24">
        <h1 className="font-serif text-[40px] md:text-5xl font-semibold mb-10 text-on-surface leading-tight">
          {user?.fullname ? `${user.fullname}'s Cart` : "Your Cart"}
        </h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="bg-white border border-outline rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-tertiary mb-4">
              shopping_cart
            </span>
            <h2 className="text-2xl font-serif font-semibold text-on-surface mb-2">
              Your cart is empty
            </h2>
            <p className="text-secondary text-lg mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-container transition-colors shadow-sm">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const variant = Array.isArray(item.product?.variants)
                  ? item.product.variants.find((v) => v._id === item.variant)
                  : item.product?.variants;
                const imageUrl =
                  variant?.images?.[0]?.url || item.product?.images?.[0]?.url;
                const itemPriceAmount =
                  variant?.price?.amount || item.price?.amount;
                const itemPriceCurrency =
                  variant?.price?.currency || item.price?.currency;

                return (
                  <div
                    key={item._id}
                    className="bg-white border border-outline rounded-2xl p-4 flex gap-6 hover:border-primary transition-all group shadow-sm"
                  >
                    <div className="w-32 h-32 rounded-xl bg-surface-dim overflow-hidden shrink-0 border border-outline">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product?.title || "Product"}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-tertiary text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-serif text-[22px] font-semibold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {item.product?.title || "Unknown Product"}
                      </h3>

                      {variant?.attributes &&
                        Object.keys(variant.attributes).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {Object.entries(variant.attributes).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className="text-xs bg-surface-dim text-secondary px-2 py-1 rounded border border-outline"
                                >
                                  <span className="opacity-70 capitalize">
                                    {key}:
                                  </span>{" "}
                                  {value}
                                </span>
                              ),
                            )}
                          </div>
                        )}

                      <div className="text-on-surface font-medium text-xl mb-3">
                        {formatPrice({
                          amount: itemPriceAmount,
                          currency: itemPriceCurrency,
                        })}
                      </div>
                      <div className="flex items-center gap-4 text-secondary">
                        <div className="flex items-center bg-white rounded-lg border border-outline overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                handleUpdateQuantity(
                                  item.product?._id || item.product,
                                  item.variant,
                                  item.quantity - 1,
                                );
                              } else {
                                handleRemoveItem(
                                  item.product?._id || item.product,
                                  item.variant,
                                );
                              }
                            }}
                            className="px-3 py-1.5 hover:bg-surface-dim hover:text-primary transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              remove
                            </span>
                          </button>
                          <span className="px-3 py-1.5 font-medium text-on-surface border-x border-outline min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product?._id || item.product,
                                item.variant,
                                item.quantity + 1,
                              )
                            }
                            className="px-3 py-1.5 hover:bg-surface-dim hover:text-primary transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              add
                            </span>
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.product?._id || item.product,
                              item.variant,
                            )
                          }
                          className="text-sm font-medium text-secondary hover:text-error transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-outline rounded-2xl p-6 sticky top-24 shadow-sm">
                <h2 className="font-serif text-2xl font-semibold text-on-surface mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 text-secondary border-b border-outline pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-on-surface font-medium">
                      {formatPrice({
                        amount: calculateTotal(),
                        currency: getCartCurrency(),
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-medium text-on-surface">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-on-surface">
                    {formatPrice({
                      amount: calculateTotal(),
                      currency: getCartCurrency(),
                    })}
                  </span>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-primary text-white font-medium text-lg py-3.5 rounded-xl hover:bg-primary-container transition-all shadow-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

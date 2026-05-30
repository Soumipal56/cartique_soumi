import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';

const Cart = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart.items);
    const { handleGetCart } = useCart();

    useEffect(() => {
        handleGetCart();
    }, []);

    const formatPrice = (price) => {
        if (!price || price.amount == null || isNaN(price.amount)) return '';
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
        const symbol = symbols[price.currency] || price.currency + ' ';
        return `${symbol}${Number(price.amount).toLocaleString()}`;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price?.amount || 0) * item.quantity;
        }, 0);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-inter">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold font-outfit text-[#10b981] mb-8">
                    {user?.fullname ? `${user.fullname}'s Cart` : 'Your Cart'}
                </h1>
                
                {(!cartItems || cartItems.length === 0) ? (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-12 backdrop-blur-md flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-400 text-xl font-medium">Your cart is empty.</p>
                        <button className="mt-6 px-6 py-3 bg-[#10b981] text-gray-900 font-bold rounded-xl hover:bg-[#34d399] transition-colors">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const variant = item.product?.variants?.find(v => v._id === item.variant);
                                const imageUrl = variant?.images?.[0]?.url || item.product?.images?.[0]?.url;
                                
                                return (
                                    <div key={item._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md flex gap-6 hover:bg-white/10 transition-colors">
                                        <div className="w-32 h-32 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/10">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={item.product?.title || 'Product'} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-xl font-semibold font-outfit text-white mb-2">{item.product?.title || 'Unknown Product'}</h3>
                                            
                                            {variant?.attributes && Object.keys(variant.attributes).length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {Object.entries(variant.attributes).map(([key, value]) => (
                                                        <span key={key} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-md border border-white/5">
                                                            <span className="opacity-70 capitalize">{key}:</span> {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="text-[#10b981] font-medium text-lg mb-2">{formatPrice(item.price)}</div>
                                            <div className="flex items-center gap-4 text-gray-400">
                                                <span className="bg-white/5 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-[#10b981]/20 rounded-2xl p-6 backdrop-blur-md sticky top-8">
                                <h2 className="text-2xl font-bold font-outfit text-white mb-6">Summary</h2>
                                <div className="space-y-4 text-gray-300 border-b border-white/10 pb-6 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">
                                            {formatPrice({ amount: calculateTotal(), currency: cartItems[0]?.price?.currency || 'USD' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-[#10b981]">Free</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-3xl font-bold text-[#10b981]">
                                        {formatPrice({ amount: calculateTotal(), currency: cartItems[0]?.price?.currency || 'USD' })}
                                    </span>
                                </div>
                                <button className="w-full bg-[#10b981] text-gray-900 font-bold text-lg py-4 rounded-xl hover:bg-[#0ea5e9] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                                    Checkout Now
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

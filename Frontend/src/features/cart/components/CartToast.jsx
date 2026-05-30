import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideCartToast } from '../state/toast.slice';
import { Link } from 'react-router';

const CartToast = () => {
    const dispatch = useDispatch();
    const { visible, product } = useSelector(state => state.toast);

    // Auto-dismiss after 4 seconds
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => dispatch(hideCartToast()), 4000);
        return () => clearTimeout(timer);
    }, [visible, dispatch]);

    return (
        <div
            className={`fixed top-6 right-6 z-[999] w-80 transition-all duration-500 ease-out ${
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
            }`}
        >
            <div className="bg-[#111] border border-[#10b981]/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden backdrop-blur-xl">
                {/* Top bar */}
                <div className="flex items-center gap-2 bg-[#10b981]/10 px-4 py-2.5 border-b border-[#10b981]/20">
                    <svg className="w-4 h-4 text-[#10b981] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-[#10b981] text-xs font-semibold tracking-wide">Added to Cart</span>
                    <button
                        onClick={() => dispatch(hideCartToast())}
                        className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Product info */}
                {product && (
                    <div className="flex gap-4 p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{product.title}</p>
                            {product.variantLabel && (
                                <p className="text-gray-400 text-xs mt-0.5">{product.variantLabel}</p>
                            )}
                            {product.price && (
                                <p className="text-[#10b981] font-medium text-sm mt-1">{product.price}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 px-4 pb-4">
                    <button
                        onClick={() => dispatch(hideCartToast())}
                        className="flex-1 text-xs font-medium py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                    >
                        Continue Shopping
                    </button>
                    <Link
                        to="/cart"
                        onClick={() => dispatch(hideCartToast())}
                        className="flex-1 text-xs font-bold py-2 rounded-lg bg-[#10b981] text-gray-900 hover:bg-[#34d399] transition-colors text-center"
                    >
                        View Cart
                    </Link>
                </div>

                {/* Auto-dismiss progress bar */}
                <div className="h-0.5 bg-white/5">
                    <div
                        className={`h-full bg-[#10b981] transition-all ${visible ? 'duration-[4000ms] ease-linear w-0' : 'w-full'}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartToast;

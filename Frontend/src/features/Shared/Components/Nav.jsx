import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Nav = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart?.items || []);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#E8E5E0]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
                <Link to="/" className="inline-block group">
                    <span className="font-serif text-2xl font-semibold tracking-wide text-[#1A1A1A] flex items-center gap-2">
                        CARTIQUE
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1B2A4A] transition-all duration-300 group-hover:scale-150"></div>
                    </span>
                </Link>
                <div>
                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-sm font-medium text-[#1B2A4A] hover:bg-[#1B2A4A]/5 px-4 py-2 rounded-lg border border-[#1B2A4A]/20 transition-colors">
                                    Seller Dashboard
                                </Link>
                            )}
                            <Link to="/cart" className="relative group flex items-center justify-center text-[#1A1A1A] hover:text-[#1B2A4A] transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItems?.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#1B2A4A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                            
                            <div className="w-px h-6 bg-[#E8E5E0]"></div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white font-medium">
                                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-sm font-medium text-[#1A1A1A]">{user.fullname || 'User'}</span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-sm font-medium text-[#6B6B6B]">Not logged in</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;

import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Nav = () => {
    const user = useSelector(state => state.auth.user);
    const cartItems = useSelector(state => state.cart?.items || []);

    return (
        <nav className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-8 pb-4 flex items-center justify-between">
            <Link to="/" className="inline-block group">
                <span className="font-outfit text-2xl font-bold tracking-widest text-white flex items-center gap-2">
                    CARTIQUE
                    <div className="w-2 h-2 rounded-full bg-[#10b981] group-hover:shadow-[0_0_12px_#10b981] transition-all duration-300"></div>
                </span>
            </Link>
            <div>
                {user ? (
                    <div className="flex items-center gap-6">
                        <Link to="/cart" className="relative group/cart flex items-center justify-center text-gray-400 hover:text-[#10b981] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItems?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#10b981] text-gray-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050505]">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        
                        <div className="w-px h-6 bg-white/10"></div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-gray-900 font-bold">
                                {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-300">{user.fullname || 'User'}</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm font-medium text-gray-500">Not logged in</span>
                )}
            </div>
        </nav>
    );
};

export default Nav;

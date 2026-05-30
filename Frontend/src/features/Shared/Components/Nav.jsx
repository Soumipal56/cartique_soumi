import React from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Nav = () => {
    const user = useSelector(state => state.auth.user);

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
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-gray-900 font-bold">
                            {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-300">{user.fullname || 'User'}</span>
                    </div>
                ) : (
                    <span className="text-sm font-medium text-gray-500">Not logged in</span>
                )}
            </div>
        </nav>
    );
};

export default Nav;

import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Home = () => {
    const user = useSelector(state => state.auth.user);
    const { handleGetAllProducts } = useProduct();
    const navigate = useNavigate()
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleGetAllProducts()
            .then(data => {
                console.log("Fetched Products Data:", data);
                setProducts(data || []);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const formatPrice = (price) => {
        if (!price) return '';
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
        const symbol = symbols[price.currency] || price.currency + ' ';
        return `${symbol}${price.amount.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-[#050505] font-inter text-white selection:bg-[#10b981]/30 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#10b981]/10 blur-[120px] animate-pulse pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#0ea5e9]/10 blur-[100px] animate-pulse pointer-events-none z-0" style={{animationDelay: '1s'}}></div>


            {/* Minimal Navbar */}
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

            <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="font-outfit text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Discover Curated <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#0ea5e9]">Premium Goods</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Explore our collection of handpicked items from verified sellers worldwide.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2rem]">
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 rounded-full bg-[#10b981] animate-bounce"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-400">Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard onClick={() => navigate(`/product/${product._id}`)} key={product._id} product={product} formatPrice={formatPrice} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2rem]">
                        <p className="text-xl text-gray-400">No products available yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const ProductCard = ({ product, formatPrice, onClick }) => {
    return (
        <div onClick={onClick} className="cursor-pointer group bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:border-[#10b981]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)]">
            <div className="aspect-[4/5] bg-black/40 relative overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img 
                        src={product.images[0].url} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-outfit text-lg font-medium text-white line-clamp-1 group-hover:text-[#10b981] transition-colors">{product.title}</h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="font-outfit text-lg font-semibold text-[#10b981]">
                        {formatPrice(product.price)}
                    </span>
                    {product.seller && (
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                            By {product.seller.name || 'Seller'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;

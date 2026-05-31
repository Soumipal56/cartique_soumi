import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Home = () => {
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
    // Gather unique color values from variants (supports Map or plain object)
    const colors = [];
    if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
            const attrs = variant.attributes;
            if (!attrs) return;
            let colorVal;
            if (attrs instanceof Map) {
                colorVal = attrs.get('color');
            } else {
                colorVal = attrs['color'];
            }
            if (colorVal && !colors.includes(colorVal)) colors.push(colorVal);
        });
    }

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
                    <h3 className="font-outfit text-lg font-medium text-white line-clamp-1 group-hover:text-[#10b981] transition-colors">
                        {product.title}
                    </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{product.description}</p>
                {/* Color badges */}
                {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {colors.map((c) => (
                            <span key={c} className="px-2 py-1 text-xs rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                                {c}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-outfit text-lg font-semibold text-[#10b981]">
                            {formatPrice(product.price)}
                        </span>
                        {product.previousPrice && product.price && product.previousPrice.amount !== product.price.amount ? (
                            <span className="text-sm text-gray-500 line-through font-outfit">
                                {formatPrice(product.previousPrice)}
                            </span>
                        ) : product.originalPrice && product.price && product.originalPrice.amount > product.price.amount ? (
                            <span className="text-sm text-gray-500 line-through font-outfit">
                                {formatPrice(product.originalPrice)}
                            </span>
                        ) : null}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        {product.previousPrice && product.price && product.previousPrice.amount !== product.price.amount ? (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${product.price.amount > product.previousPrice.amount ? 'text-red-500 bg-red-500/15 border-red-500/30' : 'text-[#10b981] bg-[#10b981]/15 border-[#10b981]/30'}`}>
                                {product.price.amount > product.previousPrice.amount ? 'Increased by' : 'Decreased by'} {formatPrice({ amount: Math.abs(product.price.amount - product.previousPrice.amount), currency: product.price.currency })}
                            </span>
                        ) : product.originalPrice && product.price && product.originalPrice.amount > product.price.amount ? (
                            <span className="text-xs font-semibold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30 whitespace-nowrap">
                                Save {formatPrice({ amount: product.originalPrice.amount - product.price.amount, currency: product.price.currency })}
                            </span>
                        ) : null}
                        {product.seller && (
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md ml-auto">
                                By {product.seller.name || 'Seller'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

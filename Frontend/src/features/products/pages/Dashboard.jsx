import { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProduct } = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleGetSellerProduct().finally(() => setIsLoading(false));
    }, []);

    const formatPrice = (price) => {
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
        const symbol = symbols[price.currency] || price.currency + ' ';
        return `${symbol}${price.amount.toLocaleString()}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float 8s ease-in-out 2s infinite; }
            `}} />

            <div className="min-h-screen bg-[#050505] font-inter text-white selection:bg-[#10b981]/30 relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#10b981]/10 blur-[120px] animate-float pointer-events-none z-0"></div>
                <div className="fixed bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#0ea5e9]/10 blur-[100px] animate-float-delayed pointer-events-none z-0"></div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 relative z-10">

                    {/* ── Top Bar ── */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 bg-[#10b981] text-gray-900 hover:bg-[#34d399]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Listing
                        </button>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-12 pb-2">
                        <h1 className="font-outfit text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white mb-4">
                            Your Listings
                        </h1>
                        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#10b981] to-[#0ea5e9]"></div>
                        <p className="mt-4 text-gray-400 text-sm sm:text-base">
                            Manage and track all your products in one place.
                        </p>
                    </div>

                    {/* ── Stats Row ── */}
                    {!isLoading && sellerProducts && sellerProducts.length > 0 && (
                        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                { label: 'Total Products', value: sellerProducts.length, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                                {
                                    label: 'Total Value',
                                    value: `₹${sellerProducts.reduce((sum, p) => sum + (p.price?.amount || 0), 0).toLocaleString()}`,
                                    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                },
                                {
                                    label: 'Total Images',
                                    value: sellerProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0),
                                    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                                },
                                {
                                    label: 'Latest Listing',
                                    value: formatDate(
                                        sellerProducts.reduce((latest, p) =>
                                            new Date(p.createdAt) > new Date(latest) ? p.createdAt : latest,
                                            sellerProducts[0].createdAt
                                        )
                                    ),
                                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                },
                            ].map((stat, i) => (
                                <div key={i} className="glass-card rounded-[2rem] p-6 relative overflow-hidden group transition-all duration-300 hover:border-[#10b981]/30">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-[#10b981]">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 mb-2">{stat.label}</p>
                                    <p className="font-outfit text-3xl sm:text-4xl font-semibold text-white tracking-tight">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Product Grid ── */}
                    <div className="mt-12 pb-24">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-32 gap-6 glass-card rounded-[2rem]">
                                <div className="flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm font-medium text-gray-400">Loading your elegant collection...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && (!sellerProducts || sellerProducts.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-32 gap-6 glass-card rounded-[2rem]">
                                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-500">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="font-outfit text-2xl font-semibold text-white mb-2">No listings found</p>
                                    <p className="text-gray-400">Start building your collection by adding your first product.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/seller/create-product')}
                                    className="mt-2 bg-[#10b981] hover:bg-[#0ea5e9] text-gray-900 font-semibold py-3 px-8 rounded-xl transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:-translate-y-0.5"
                                >
                                    Create First Listing
                                </button>
                            </div>
                        )}

                        {/* Products */}
                        {!isLoading && sellerProducts && sellerProducts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                {sellerProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        formatPrice={formatPrice}
                                        formatDate={formatDate}
                                        onClick={() => navigate(`/seller/product/${product._id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ────────────────────────────────────────────
   Product Card Component
   ──────────────────────────────────────────── */
const ProductCard = ({ product, formatPrice, formatDate, onClick }) => {
    const [activeImage, setActiveImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = product.images || [];

    const nextImage = (e) => {
        e.stopPropagation();
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            onClick={onClick}
            className="cursor-pointer glass-card rounded-[2rem] overflow-hidden group transition-all duration-500 hover:border-[#10b981]/30 hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* ── Image Carousel ── */}
            <div className="relative aspect-[4/3] sm:aspect-[4/5] bg-black/40 overflow-hidden">
                {images.length > 0 ? (
                    <>
                        {/* Image with crossfade */}
                        <div className="absolute inset-0">
                            {images.map((img, i) => (
                                <img
                                    key={img._id}
                                    src={img.url}
                                    alt={`${product.title} — ${i + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
                                    style={{
                                        opacity: i === activeImage ? 1 : 0,
                                        transform: isHovered && i === activeImage ? 'scale(1.05)' : 'scale(1)',
                                    }}
                                />
                            ))}
                            {/* Gradient overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <div
                                className="absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300"
                                style={{ opacity: isHovered ? 1 : 0 }}
                            >
                                <button
                                    onClick={prevImage}
                                    className="w-8 h-8 rounded-full flex items-center justify-center glass-card hover:bg-[#10b981] hover:border-[#10b981] hover:text-gray-900 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="w-8 h-8 rounded-full flex items-center justify-center glass-card hover:bg-[#10b981] hover:border-[#10b981] hover:text-gray-900 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Dot indicators */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(i);
                                        }}
                                        className="transition-all duration-300 rounded-full"
                                        style={{
                                            width: i === activeImage ? '20px' : '6px',
                                            height: '6px',
                                            backgroundColor: i === activeImage ? '#10b981' : 'rgba(255,255,255,0.4)',
                                        }}
                                        aria-label={`View image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image count badge */}
                        <div className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-lg glass-card z-10">
                            {activeImage + 1}/{images.length}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* ── Product Info ── */}
            <div className="p-6 flex flex-col gap-3 flex-1">
                {/* Title + Price */}
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-outfit text-xl font-medium leading-snug text-white group-hover:text-[#10b981] transition-colors duration-300 line-clamp-1">
                        {product.title}
                    </h3>
                    <span className="font-outfit text-lg font-semibold text-[#10b981] shrink-0 bg-[#10b981]/10 px-2 py-0.5 rounded-md border border-[#10b981]/20">
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">
                    {product.description}
                </p>

                {/* Metadata row */}
                <div className="flex items-center gap-4 mt-2 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(product.createdAt)}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {product.images?.length || 0} {product.images?.length === 1 ? 'image' : 'images'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

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
            <link
                href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#10b981]/30"
                style={{ backgroundColor: '#131313', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => navigate(-1)}
                                className="text-lg transition-colors duration-200 leading-none"
                                style={{ color: '#a3a3a3' }}
                                aria-label="Go back"
                                id="dashboard-back-btn"
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                            >
                                ←
                            </button>
                            <span
                                className="text-xs font-bold tracking-[0.32em] uppercase"
                                style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#10b981' }}
                            >
                                CARTIQUE.
                            </span>
                        </div>
                        <button
                            id="dashboard-add-product-btn"
                            onClick={() => navigate('/seller/create-product')}
                            className="flex items-center gap-2.5 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                            style={{
                                backgroundColor: '#1e1e1e',
                                color: '#ffffff',
                                border: '1px solid #2d2d2d',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#10b981';
                                e.currentTarget.style.color = '#131313';
                                e.currentTarget.style.borderColor = '#10b981';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#1e1e1e';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.borderColor = '#2d2d2d';
                            }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Listing
                        </button>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-0">
                        <h1
                            className="text-4xl lg:text-5xl font-semibold leading-tight"
                            style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#ffffff' }}
                        >
                            Your Listings
                        </h1>
                        <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#10b981' }} />
                        <p className="mt-5 text-sm leading-relaxed" style={{ color: '#a3a3a3' }}>
                            Manage and track all your products in one place.
                        </p>
                    </div>

                    {/* ── Stats Row ── */}
                    {!isLoading && sellerProducts && sellerProducts.length > 0 && (
                        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ backgroundColor: '#2d2d2d' }}>
                            {[
                                { label: 'Total Products', value: sellerProducts.length },
                                {
                                    label: 'Total Value',
                                    value: `₹${sellerProducts.reduce((sum, p) => sum + (p.price?.amount || 0), 0).toLocaleString()}`,
                                },
                                {
                                    label: 'Total Images',
                                    value: sellerProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0),
                                },
                                {
                                    label: 'Latest Listing',
                                    value: formatDate(
                                        sellerProducts.reduce((latest, p) =>
                                            new Date(p.createdAt) > new Date(latest) ? p.createdAt : latest,
                                            sellerProducts[0].createdAt
                                        )
                                    ),
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="px-6 py-6"
                                    style={{ backgroundColor: '#131313' }}
                                >
                                    <p
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#d3c5ac' }}
                                    >
                                        {stat.label}
                                    </p>
                                    <p
                                        className="mt-2 text-xl font-semibold"
                                        style={{ fontFamily: "'Hanken Grotesk', sans-serif", color: '#ffffff' }}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Product Grid ── */}
                    <div className="mt-14 pb-24">

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-32 gap-5">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                                            style={{
                                                backgroundColor: '#10b981',
                                                animationDelay: `${i * 200}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#a3a3a3' }}>
                                    Loading your listings...
                                </p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && (!sellerProducts || sellerProducts.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-32 gap-6">
                                <div
                                    className="w-16 h-16 flex items-center justify-center border"
                                    style={{ borderColor: '#2d2d2d', color: '#525252' }}
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium" style={{ color: '#ffffff' }}>No listings yet</p>
                                    <p className="text-xs mt-2 leading-relaxed" style={{ color: '#a3a3a3' }}>
                                        Start by creating your first product listing.
                                    </p>
                                </div>
                                <button
                                    id="dashboard-empty-add-btn"
                                    onClick={() => navigate('/seller/create-product')}
                                    className="mt-2 px-6 py-3 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{ backgroundColor: '#10b981', color: '#131313' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#34d399')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                                >
                                    Create First Listing
                                </button>
                            </div>
                        )}

                        {/* Products */}
                        {!isLoading && sellerProducts && sellerProducts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {sellerProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        formatPrice={formatPrice}
                                        formatDate={formatDate}
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
const ProductCard = ({ product, formatPrice, formatDate }) => {
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
            className="group flex flex-col transition-all duration-500"
            style={{ backgroundColor: '#131313' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id={`product-card-${product._id}`}
        >
            {/* ── Image Carousel ── */}
            <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
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
                                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <div
                                className="absolute inset-0 flex items-center justify-between px-3 transition-opacity duration-300"
                                style={{ opacity: isHovered ? 1 : 0 }}
                            >
                                <button
                                    onClick={prevImage}
                                    className="w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                                    style={{
                                        backgroundColor: 'rgba(19, 19, 19, 0.6)',
                                        color: '#ffffff',
                                    }}
                                    aria-label="Previous image"
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.8)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(19,19,19,0.6)')}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                                    style={{
                                        backgroundColor: 'rgba(19, 19, 19, 0.6)',
                                        color: '#ffffff',
                                    }}
                                    aria-label="Next image"
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.8)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(19,19,19,0.6)')}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Dot indicators */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImage(i);
                                        }}
                                        className="transition-all duration-300"
                                        style={{
                                            width: i === activeImage ? '16px' : '5px',
                                            height: '5px',
                                            borderRadius: '9999px',
                                            backgroundColor: i === activeImage ? '#10b981' : 'rgba(255,255,255,0.4)',
                                        }}
                                        aria-label={`View image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image count badge */}
                        <div
                            className="absolute top-3 right-3 px-2 py-1 text-[9px] tracking-[0.1em] uppercase backdrop-blur-sm"
                            style={{
                                backgroundColor: 'rgba(19, 19, 19, 0.6)',
                                color: '#ffffff',
                            }}
                        >
                            {activeImage + 1}/{images.length}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#525252' }}>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* ── Product Info ── */}
            <div className="pt-4 pb-5 px-1 flex flex-col gap-2">
                {/* Title + Price */}
                <div className="flex items-start justify-between gap-4">
                    <h3
                        className="text-sm font-medium leading-snug transition-colors duration-300"
                        style={{ color: isHovered ? '#ffffff' : '#e5e2e1', fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                        {product.title}
                    </h3>
                    <span
                        className="text-sm font-semibold shrink-0"
                        style={{ color: '#10b981', fontFamily: "'Hanken Grotesk', sans-serif" }}
                    >
                        {formatPrice(product.price)}
                    </span>
                </div>

                {/* Description */}
                <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: '#a3a3a3' }}
                >
                    {product.description}
                </p>

                {/* Metadata row */}
                <div className="flex items-center gap-3 mt-1">
                    <span
                        className="text-[10px] uppercase tracking-[0.15em]"
                        style={{ color: '#525252' }}
                    >
                        {formatDate(product.createdAt)}
                    </span>
                    <span style={{ color: '#2d2d2d' }}>·</span>
                    <span
                        className="text-[10px] uppercase tracking-[0.15em]"
                        style={{ color: '#525252' }}
                    >
                        {product.images?.length || 0} {product.images?.length === 1 ? 'image' : 'images'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

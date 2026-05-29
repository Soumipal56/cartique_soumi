import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const ProductDetail = () => {
    const { id, productId } = useParams();
    const resolvedId = id || productId;
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!resolvedId) return;
        handleGetProductById(resolvedId)
            .then(data => {
                setProduct(data);
            })
            .finally(() => setIsLoading(false));
    }, [resolvedId]);

    const formatPrice = (price) => {
        if (!price || price.amount == null || isNaN(price.amount)) return '';
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
        const symbol = symbols[price.currency] || price.currency + ' ';
        return `${symbol}${Number(price.amount).toLocaleString()}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-[#10b981] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white font-inter">
                <h1 className="text-3xl font-bold mb-4 font-outfit">Product not found</h1>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#10b981] text-gray-900 rounded-xl font-semibold hover:bg-[#34d399] transition-all">Go Back</button>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="min-h-screen bg-[#050505] font-inter text-white selection:bg-[#10b981]/30 relative overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#10b981]/10 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#0ea5e9]/10 blur-[100px] pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10 pt-10">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-[#10b981] transition-colors duration-300 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-square bg-black/40 rounded-3xl overflow-hidden border border-white/5 relative group">
                            {images.length > 0 ? (
                                <img src={images[activeImage].url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, i) => (
                                    <button 
                                        key={img._id} 
                                        onClick={() => setActiveImage(i)}
                                        className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-[#10b981]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        <h1 className="font-outfit text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
                        <div className="text-3xl font-semibold text-[#10b981] mb-8 font-outfit">
                            {formatPrice(product.price)}
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-md">
                            <h3 className="text-lg font-medium mb-3 font-outfit text-gray-200">Description</h3>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>

<div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-md">
  <h3 className="text-lg font-medium mb-3 font-outfit text-gray-200">Variants</h3>
  {product.variants && product.variants.length > 0 ? (
    product.variants.map((variant, idx) => (
      <div key={idx} className="border-b border-white/10 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
        <p className="text-gray-400">Stock: {variant.stock}</p>
        {variant.price && (
          <p className="text-[#10b981]">Price: {formatPrice(variant.price)}</p>
        )}
        {variant.attributes && (
          <div className="mt-2">
            {Array.from(variant.attributes.entries()).map(([key, value]) => (
              <p key={key} className="text-gray-400">{key}: {value}</p>
            ))}
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-400">No variants available</p>
  )}
</div>


                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 bg-white/5 border border-[#10b981]/40 text-[#10b981] font-bold text-lg py-4 rounded-xl hover:bg-[#10b981]/10 hover:border-[#10b981] transition-all duration-300">
                                Add to Cart
                            </button>
                            <button className="flex-1 bg-[#10b981] text-gray-900 font-bold text-lg py-4 rounded-xl hover:bg-[#0ea5e9] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import ProductDetail from './ProductDetail';

const SellerProductDetails = () => {
    const { id, productId } = useParams();
    const resolvedId = id || productId;
    const navigate = useNavigate();
    const { handleGetProductById, handleAddProductVariant } = useProduct();
    const [product, setProduct] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [newVariant, setNewVariant] = useState({ images: [], attributes: {}, price: { amount: '', currency: 'INR' }, stock: '' });
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(null); // tracks selected variant in seller view
    const [attrEntries, setAttrEntries] = useState([{ key: '', value: '' }]);

    const handleVariantImages = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setNewVariant((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages].slice(0, 7),
        }));
    };

    const updateAttrEntry = (idx, field, value) => {
        setAttrEntries((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    const addAttrEntry = () => {
        setAttrEntries((prev) => [...prev, { key: "", value: "" }]);
    };

    const removeAttrEntry = (idx) => {
        setAttrEntries((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleAddVariant = async () => {
        // Ensure stock is provided and non‑negative before creating the variant
        if (newVariant.stock === undefined || newVariant.stock === null || newVariant.stock === '' || newVariant.stock < 0) {
            alert('Please provide a valid stock quantity (0 or more).');
            return;
        }
        const attributes = attrEntries.reduce((acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
        }, {});
        const variant = {
            images: newVariant.images,
            attributes,
            stock: newVariant.stock,
            price: newVariant.price,
        };
        console.log("New variant", variant);
        
        try {
            const response = await handleAddProductVariant(product._id, variant);
            console.log('Variant added:', response);
            // Refresh product data to show new variant
            const refreshed = await handleGetProductById(resolvedId);
            setProduct(refreshed);
            // Auto-select the newly added variant (last one)
            if (refreshed && refreshed.variants && refreshed.variants.length > 0) {
                setSelectedVariantIdx(refreshed.variants.length - 1);
            }
        } catch (err) {
            console.error('Error adding variant:', err);
            alert('Failed to add variant. See console for details.');
        }

        setNewVariant({ images: [], attributes: {}, price: { amount: "", currency: "INR" }, stock: '' });
        setAttrEntries([{ key: "", value: "" }]);
    };

    useEffect(() => {
        if (!resolvedId) return;
        handleGetProductById(resolvedId)
            .then(data => {
                setProduct(data);
                setLikes(data.likes || 0);
                // Auto-select first variant if available
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariantIdx(0);
                } else {
                    setSelectedVariantIdx(null);
                }
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

    const getVariantRating = (variant) => {
        if (!variant.ratings || variant.ratings.length === 0) return "0.0";
        const total = variant.ratings.reduce((acc, r) => acc + r.score, 0);
        return (total / variant.ratings.length).toFixed(1);
    };

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
                         <div className="flex items-center space-x-4 mb-8">
                             <div className="text-3xl font-semibold text-[#10b981] font-outfit">
                                 {formatPrice(product.price)}
                             </div>
                             <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm font-semibold">
                                 <span>⭐</span>
                                 <span>{product.rating ? Number(product.rating).toFixed(1) : "0.0"}/10</span>
                             </div>
                             <button onClick={() => {
                                 setLiked(!liked);
                                 setLikes(prev => liked ? Math.max(0, prev - 1) : prev + 1);
                             }} className="flex items-center space-x-1 text-gray-400 hover:text-[#10b981] transition-colors">
                                 {liked ? "❤️" : "🤍"}
                                 <span>{likes}</span>
                             </button>
                         </div>
                        
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-8 backdrop-blur-md">
                            <h3 className="text-lg font-medium mb-3 font-outfit text-gray-200">Description</h3>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>

                        {product.variants && product.variants.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-3 font-outfit text-gray-200">Variants</h3>
                            {product.variants.map((variant, vIdx) => (
                              <div key={vIdx}
                                   className={`bg-white/5 border ${selectedVariantIdx === vIdx ? 'border-[#10b981]' : 'border-white/5'} rounded-2xl p-4 mb-4`}
                                   onClick={() => setSelectedVariantIdx(vIdx)}>
                                {/* Variant Images */}
                                {variant.images && variant.images.length > 0 && (
                                  <div className="flex gap-2 mb-2 overflow-x-auto">
                                    {variant.images.map((img, i) => (
                                      <img key={i} src={img.url} alt={`Variant ${vIdx} image ${i}`} className="w-20 h-20 object-cover rounded-md" />
                                    ))}
                                  </div>
                                )}
                                {/* Attributes */}
                                {variant.attributes && Object.keys(variant.attributes).length > 0 ? (
                                  <ul className="list-disc list-inside text-gray-300">
                                    {Object.entries(variant.attributes).map(([key, value]) => (
                                      <li key={key}>{key}: {value}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-red-400">No attributes defined.</p>
                                )}
                                {/* Variant Price */}
                                {variant.stock !== undefined && (
                                   <p className="text-gray-400 mt-2">Stock: {variant.stock}</p>
                                 )}
                                 {variant.price && (
                                   <p className="text-[#10b981] mt-2">{formatPrice(variant.price)}</p>
                                 )}
                                 <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 mt-3 w-max rounded-full text-xs font-semibold">
                                     <span>⭐</span>
                                     <span>{getVariantRating(variant)}/10 ({variant.ratings?.length || 0} reviews)</span>
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 bg-white/5 border border-blue-500/40 text-blue-500 font-bold text-lg py-4 rounded-xl hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300">
                                Edit Product
                            </button>
                            <button className="flex-1 bg-red-500/10 border border-red-500/40 text-red-500 font-bold text-lg py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300">
                                Delete Product
                            </button>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-3 font-outfit text-gray-200">Add New Variant</h3>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Variant Images (max 7)</label>
                                <input type="file" multiple accept="image/*" onChange={handleVariantImages} disabled={newVariant.images.length >= 7} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#10b981]/20 file:text-[#10b981] hover:file:bg-[#10b981]/30" />
                                <div className="flex gap-2 mt-2 overflow-x-auto">
                                    {newVariant.images.map((img, i) => (
                                        <img key={i} src={img.url} alt={`New variant ${i}`} className="w-20 h-20 object-cover rounded-md" />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Attributes</label>
                                {attrEntries.map((entry, idx) => (
                                    <div key={idx} className="flex gap-2 mb-2 items-center">
                                        <input type="text" placeholder="Key" value={entry.key} onChange={e => updateAttrEntry(idx, 'key', e.target.value)} className="flex-1 px-2 py-1 bg-white/5 rounded" />
                                        <input type="text" placeholder="Value" value={entry.value} onChange={e => updateAttrEntry(idx, 'value', e.target.value)} className="flex-1 px-2 py-1 bg-white/5 rounded" />
                                        <button type="button" onClick={() => removeAttrEntry(idx)} className="text-red-500 hover:text-red-300">✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={addAttrEntry} className="mt-2 text-[#10b981] hover:underline">Add Attribute</button>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Price (optional)</label>
                                <input type="number" placeholder="Amount" value={newVariant.price.amount} onChange={e => setNewVariant(prev => ({ ...prev, price: { ...prev.price, amount: e.target.value } }))} className="w-full px-2 py-1 bg-white/5 rounded" />
                                <select value={newVariant.price.currency} onChange={e => setNewVariant(prev => ({ ...prev, price: { ...prev.price, currency: e.target.value } }))} className="w-full mt-2 px-2 py-1 bg-white/5 rounded">
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="JPY">JPY</option>
                                </select>
                                <input type="number" placeholder="Stock" value={newVariant.stock} onChange={e => setNewVariant(prev => ({ ...prev, stock: e.target.value === '' ? '' : Number(e.target.value) }))} min={0} required className="w-full mt-2 px-2 py-1 bg-white/5 rounded" />
                            </div>
                            <button onClick={handleAddVariant} className="px-4 py-2 bg-[#10b981] text-gray-900 rounded hover:bg-[#0ea5e9] transition">Add Variant</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProductDetails;
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-tertiary text-on-surface border-b border-outline hover:border-primary focus:border-primary";

    return (
        <div className="min-h-screen bg-surface-dim selection:bg-primary-fixed/50 font-sans text-on-surface">
            <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">

                {/* ── Page Header ── */}
                <div className="pt-10 pb-0">
                    <h1 className="text-4xl lg:text-5xl font-semibold leading-tight font-serif text-on-surface">
                        New Listing
                    </h1>
                    <div className="mt-4 w-14 h-px bg-primary" />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="pt-14 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">

                        {/* ── LEFT COLUMN: Text Fields ── */}
                        <div className="flex flex-col gap-12">

                            {/* Product Title */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="cp-title"
                                    className="text-xs uppercase tracking-wider font-semibold text-secondary"
                                >
                                    Product Title
                                </label>
                                <input
                                    id="cp-title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Oversized Linen Shirt"
                                    className={inputClass}
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="cp-description"
                                    className="text-xs uppercase tracking-wider font-semibold text-secondary"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="cp-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe the product — material, fit, details..."
                                    className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-tertiary text-on-surface border-b border-outline hover:border-primary focus:border-primary"
                                />
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs uppercase tracking-wider font-semibold text-secondary">
                                    Price
                                </label>
                                <div className="flex gap-5 items-end">
                                    {/* Amount */}
                                    <div className="flex flex-col gap-1 flex-[3]">
                                        <span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">Amount</span>
                                        <input
                                            id="cp-priceAmount"
                                            type="number"
                                            name="priceAmount"
                                            value={formData.priceAmount}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className={`${inputClass} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]`}
                                        />
                                    </div>
                                    {/* Currency */}
                                    <div className="flex flex-col gap-1 flex-[1]">
                                        <span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">Currency</span>
                                        <select
                                            id="cp-priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300 border-b border-outline hover:border-primary focus:border-primary text-on-surface"
                                        >
                                            {CURRENCIES.map(c => (
                                                <option key={c} value={c} className="bg-white text-on-surface">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Images ── */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs uppercase tracking-wider font-semibold text-secondary">
                                    Images
                                </label>
                                <span className="text-[10px] font-medium text-tertiary">
                                    {images.length}/{MAX_IMAGES}
                                </span>
                            </div>

                            {/* Drop Zone */}
                            {images.length < MAX_IMAGES && (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border border-dashed px-8 py-14 lg:py-20 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 rounded-[4px] ${isDragging ? 'border-primary bg-primary-fixed/20' : 'border-outline hover:border-primary bg-white'}`}
                                >
                                    {/* Upload icon */}
                                    <div className={`w-10 h-10 flex items-center justify-center border rounded-full transition-colors duration-300 ${isDragging ? 'border-primary text-primary' : 'border-outline text-tertiary'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm leading-relaxed text-secondary font-medium">
                                            Drop images here or{' '}
                                            <span className="text-primary underline underline-offset-2">
                                                tap to upload
                                            </span>
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest mt-2 text-tertiary">
                                            Up to {MAX_IMAGES} images
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square overflow-hidden group border border-outline rounded-[4px] bg-white"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Remove overlay */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase bg-on-surface/70 text-white"
                                                aria-label={`Remove image ${index + 1}`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Submit Button ── */}
                    <div className="mt-16 lg:mt-20">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 bg-primary text-on-primary font-medium text-[13px] uppercase tracking-widest rounded-[4px] hover:bg-primary-container transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
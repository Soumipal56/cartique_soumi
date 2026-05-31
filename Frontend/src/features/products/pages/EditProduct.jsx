import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const MAX_IMAGES = 7;

const EditProduct = () => {
  const { id, productId } = useParams();
  const resolvedId = id || productId;
  const { handleGetProductById, handleUpdateProduct } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!resolvedId) return;
    handleGetProductById(resolvedId)
      .then((data) => {
        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            priceAmount: data.price?.amount || "",
            priceCurrency: data.price?.currency || "INR",
          });
          // For existing images, we'll keep them as preview URLs for visual reference.
          // If the user uploads new images, we will overwrite the old ones in the backend.
          if (data.images && data.images.length > 0) {
            setImages(
              data.images.map((img) => ({
                file: null,
                preview: img.url,
                isExisting: true,
              })),
            );
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [resolvedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (files) => {
    // If adding new files, clear existing ones if they are just previews to replace them
    // Alternatively, just append if under limit.
    setImages((prev) => {
      const currentFiles = prev.filter((img) => !img.isExisting); // clear existing ones if user wants to upload new? Let's just append for now and handle replacement in backend
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) return prev;

      const toAdd = Array.from(files).slice(0, remaining);
      const newImages = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      }));
      return [...prev, ...newImages];
    });
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [images],
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      if (!updated[index].isExisting) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);

      const newImageFiles = images.filter((img) => !img.isExisting);
      if (newImageFiles.length > 0) {
        newImageFiles.forEach((img) => data.append("images", img.file));
      }

      await handleUpdateProduct(resolvedId, data);
      navigate(`/seller/product/${resolvedId}`);
    } catch (err) {
      console.error("Failed to update product", err);
      alert(
        "Failed to update product: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-dim flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-tertiary text-on-surface border-b border-outline hover:border-primary focus:border-primary";

  return (
    <div className="min-h-screen bg-surface-dim selection:bg-primary-fixed/50 font-sans text-on-surface">
      <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">
        <div className="pt-10 pb-0 flex justify-between items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight font-serif text-on-surface">
              Edit Listing
            </h1>
            <div className="mt-4 w-14 h-px bg-primary" />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-outline hover:border-primary rounded-md transition text-sm text-secondary font-medium"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-14 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 lg:items-start">
            {/* ── LEFT COLUMN: Text Fields ── */}
            <div className="flex flex-col gap-12">
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

              <div className="flex flex-col gap-3">
                <label className="text-xs uppercase tracking-wider font-semibold text-secondary">
                  Price
                </label>
                <div className="flex gap-5 items-end">
                  <div className="flex flex-col gap-1 flex-[3]">
                    <span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">
                      Amount
                    </span>
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
                  <div className="flex flex-col gap-1 flex-[1]">
                    <span className="text-[10px] uppercase tracking-widest text-tertiary font-medium">
                      Currency
                    </span>
                    <select
                      id="cp-priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300 border-b border-outline hover:border-primary focus:border-primary text-on-surface"
                    >
                      {CURRENCIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          className="bg-white text-on-surface"
                        >
                          {c}
                        </option>
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
                  Images (Uploading new overrides old ones)
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
                  className={`border border-dashed px-8 py-14 lg:py-20 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 rounded-[4px] ${
                    isDragging
                      ? "border-primary bg-primary-fixed/20"
                      : "border-outline hover:border-primary bg-white"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center border rounded-full transition-colors duration-300 ${isDragging ? 'border-primary text-primary' : 'border-outline text-tertiary'}`}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm leading-relaxed text-secondary font-medium">
                      Drop images here or{" "}
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
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase bg-on-surface/70 text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 lg:mt-20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-primary text-on-primary font-medium text-[13px] uppercase tracking-widest rounded-[4px] hover:bg-primary-container transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

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

  const inputClass =
    "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#525252]";
  const inputStyle = {
    color: "#ffffff",
    borderBottom: "1px solid #2d2d2d",
    fontFamily: "'Inter', sans-serif",
  };
  const handleFocus = (e) => {
    e.target.style.borderBottomColor = "#10b981";
  };
  const handleBlur = (e) => {
    e.target.style.borderBottomColor = "#2d2d2d";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-[#10b981] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#10b981]/30"
        style={{
          backgroundColor: "#131313",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">
          <div className="pt-10 pb-0 flex justify-between items-center">
            <div>
              <h1
                className="text-4xl lg:text-5xl font-semibold leading-tight"
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  color: "#ffffff",
                }}
              >
                Edit Listing
              </h1>
              <div
                className="mt-4 w-14 h-px"
                style={{ backgroundColor: "#10b981" }}
              />
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm"
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
                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: "#d3c5ac" }}
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
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="cp-description"
                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: "#d3c5ac" }}
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
                    className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#525252]"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: "#d3c5ac" }}
                  >
                    Price
                  </label>
                  <div className="flex gap-5 items-end">
                    <div className="flex flex-col gap-1 flex-[3]">
                      <span
                        className="text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: "#a3a3a3" }}
                      >
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
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-[1]">
                      <span
                        className="text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: "#a3a3a3" }}
                      >
                        Currency
                      </span>
                      <select
                        id="cp-priceCurrency"
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300"
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      >
                        {CURRENCIES.map((c) => (
                          <option
                            key={c}
                            value={c}
                            style={{
                              backgroundColor: "#1e1e1e",
                              color: "#ffffff",
                            }}
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
                  <label
                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                    style={{ color: "#d3c5ac" }}
                  >
                    Images (Uploading new overrides old ones)
                  </label>
                  <span className="text-[10px]" style={{ color: "#a3a3a3" }}>
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
                    className="border border-dashed px-8 py-14 lg:py-20 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: isDragging ? "#10b981" : "#2d2d2d",
                      backgroundColor: isDragging
                        ? "rgba(16,185,129,0.04)"
                        : "transparent",
                    }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center border transition-colors duration-300"
                      style={{
                        borderColor: isDragging ? "#10b981" : "#2d2d2d",
                        color: isDragging ? "#10b981" : "#a3a3a3",
                      }}
                    >
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
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#d3c5ac" }}
                      >
                        Drop images here or{" "}
                        <span
                          style={{
                            color: "#10b981",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                          }}
                        >
                          tap to upload
                        </span>
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-[0.15em] mt-2"
                        style={{ color: "#a3a3a3" }}
                      >
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
                        className="relative aspect-square overflow-hidden group border border-[#2d2d2d]"
                        style={{ backgroundColor: "#1e1e1e" }}
                      >
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                          style={{
                            backgroundColor: "rgba(19,19,19,0.7)",
                            color: "#ffffff",
                          }}
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
                className="w-full py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSubmitting ? "#a3a3a3" : "#1e1e1e",
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.color = "#131313";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#1e1e1e";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProduct;

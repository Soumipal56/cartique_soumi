import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hook/useCart";
import ImageMagnifier from "../components/ImageMagnifier";

const ProductDetail = () => {
  const { id, productId } = useParams();
  const resolvedId = id || productId;
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
  const { handleAddItem } = useCart();

  useEffect(() => {
    if (!resolvedId) return;
    handleGetProductById(resolvedId)
      .then((data) => {
        console.log("Fetched product detail:", data);
        setProduct(data);
      })
      .finally(() => setIsLoading(false));
  }, [resolvedId]);

  // Set default variant index when product data is loaded
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariantIdx(0);
    }
  }, [product]);

  const formatPrice = (price) => {
    if (!price || price.amount == null || isNaN(price.amount)) return "";
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    const symbol = symbols[price.currency] || price.currency + " ";
    return `${symbol}${Number(price.amount).toLocaleString()}`;
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

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-dim flex flex-col items-center justify-center text-on-surface font-sans">
        <h1 className="text-3xl font-semibold mb-4 font-serif">
          Product not found
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-6 h-12 bg-primary text-on-primary rounded font-medium hover:bg-primary-container transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const displayedImages =
    selectedVariantIdx !== null &&
    product.variants &&
    product.variants[selectedVariantIdx] &&
    product.variants[selectedVariantIdx].images &&
    product.variants[selectedVariantIdx].images.length > 0
      ? product.variants[selectedVariantIdx].images
      : images;

  // Helper to safely get a value from the selected variant or fall back to the main product
  const getVariantValue = (key) => {
    if (selectedVariantIdx === null) return product[key];
    const variant = product.variants[selectedVariantIdx];
    if (!variant) return product[key];
    // For nested objects like price or attributes, handle specially
    if (key === "price") return variant.price || product.price;
    if (key === "stock")
      return variant.stock != null ? variant.stock : product.stock;
    if (key === "attributes") {
      // Merge attribute maps, preferring variant values
      const merged = new Map();
      // Helper to add entries from either Map or plain object
      const addEntries = (src) => {
        if (!src) return;
        if (src instanceof Map) {
          for (const [k, v] of src.entries()) merged.set(k, v);
        } else {
          // Assume plain object
          for (const [k, v] of Object.entries(src)) merged.set(k, v);
        }
      };
      addEntries(product.attributes);
      addEntries(variant.attributes);
      return merged;
    }
    return variant[key] !== undefined ? variant[key] : product[key];
  };

  return (
    <div className="min-h-screen bg-surface-dim font-sans text-on-surface selection:bg-primary/20 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-10">
        <button
          onClick={() => navigate(-1)}
          className="text-secondary hover:text-primary transition-colors duration-300 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-outline hover:border-primary mb-8"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square bg-white rounded-lg overflow-hidden border border-outline relative group">
              {displayedImages.length > 0 ? (
                <ImageMagnifier
                  src={displayedImages[activeImage].url}
                  alt={product.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-tertiary">
                  No Image
                </div>
              )}
            </div>
            {displayedImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {displayedImages.map((img, i) => (
                  <button
                    key={img._id || i}
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-24 shrink-0 rounded overflow-hidden border-[1.5px] transition-all ${activeImage === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-[32px] md:text-[40px] font-semibold mb-4 leading-tight">
              {product.title}
            </h1>
            <div className="mb-8 border-b border-outline pb-8">
              <div className="flex items-end gap-4 flex-wrap">
                <span className="text-3xl font-medium font-sans text-on-surface">
                  {formatPrice(product.price)}
                </span>
                
                {product.previousPrice && product.price && product.previousPrice.amount !== product.price.amount ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-tertiary line-through font-sans mb-1">
                      {formatPrice(product.previousPrice)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold mb-1 border ${product.price.amount > product.previousPrice.amount ? 'text-error bg-error-container/20 border-error/20' : 'text-primary bg-primary-fixed border-primary/20'}`}>
                      {product.price.amount > product.previousPrice.amount ? 'Increased by' : 'Decreased by'} {formatPrice({ amount: Math.abs(product.price.amount - product.previousPrice.amount), currency: product.price.currency })}
                    </span>
                  </div>
                ) : product.originalPrice && product.price && product.originalPrice.amount > product.price.amount ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-tertiary line-through font-sans mb-1">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="px-2.5 py-1 rounded-sm text-xs font-semibold bg-primary-fixed text-primary border border-primary/20 mb-1">
                      Save {formatPrice({ amount: product.originalPrice.amount - product.price.amount, currency: product.price.currency })}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-white border border-outline rounded-[4px] p-6 mb-8">
              <h3 className="text-base font-semibold mb-3 font-sans text-on-surface">
                Description
              </h3>
              <p className="text-secondary text-[15px] leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Variants Section */}
            <div className="mb-8">
                <h3 className="text-base font-semibold mb-4 font-sans text-on-surface">
                    Available Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((variant, idx) => {
                      const isSelected = selectedVariantIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`cursor-pointer p-4 rounded-[4px] border transition-all ${isSelected ? "bg-primary-fixed/30 border-primary" : "bg-white border-outline hover:border-primary/50"}`}
                          onClick={() => setSelectedVariantIdx(idx)}
                        >
                          <p className="text-secondary text-sm mb-1">
                            Stock: {variant.stock ?? getVariantValue("stock")}
                          </p>
                          {variant.price && (
                            <p className="text-on-surface font-medium text-[15px]">
                              {formatPrice(variant.price)}
                            </p>
                          )}
                          {variant.attributes && (
                            <div className="mt-2 pt-2 border-t border-outline/50">
                              {(variant.attributes instanceof Map
                                ? Array.from(variant.attributes.entries())
                                : Object.entries(variant.attributes)
                              ).map(([key, value]) => (
                                <p key={key} className="text-tertiary text-xs uppercase tracking-wider mt-1">
                                  {key}: <span className="text-secondary font-medium normal-case tracking-normal">{value}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-tertiary text-sm italic">No variants available</p>
                  )}
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  if (selectedVariantIdx === null) {
                    alert("Please select a variant first");
                    return;
                  }
                  const variant = product.variants[selectedVariantIdx];
                  const imageUrl =
                    variant?.images?.[0]?.url ||
                    product.images?.[0]?.url ||
                    null;
                  const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
                  const price = variant?.price || product.price;
                  const priceStr = price
                    ? `${symbols[price.currency] || ""}${Number(price.amount).toLocaleString()}`
                    : null;
                  const variantAttrs = variant?.attributes
                    ? Object.entries(variant.attributes)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")
                    : null;

                  handleAddItem(product._id ?? product.id, variant._id, 1, {
                    title: product.title,
                    image: imageUrl,
                    price: priceStr,
                    variantLabel: variantAttrs,
                  }).catch((err) =>
                    alert(
                      err.response?.data?.message || "Failed to add to cart",
                    ),
                  );
                }}
                className="flex-1 bg-white border-2 border-primary text-primary font-medium text-base h-12 rounded-[4px] hover:bg-primary-fixed/20 transition-all duration-300"
              >
                Add to Cart
              </button>
              <button className="flex-1 bg-primary text-on-primary font-medium text-base h-12 rounded-[4px] hover:bg-primary-container transition-all duration-300">
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

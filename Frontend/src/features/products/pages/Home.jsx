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
    <div className="min-h-screen bg-surface-dim font-sans text-on-surface selection:bg-primary/20 relative">
      <main className="relative z-10 w-full">
        {/* Premium Hero Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-24 pb-16 text-center">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="font-serif text-[40px] md:text-5xl font-semibold mb-6 text-on-surface leading-tight">
              Discover Curated <br />
              <span className="text-primary">Premium Goods</span>
            </h1>
            <p className="text-secondary text-lg">
              Explore our collection of handpicked items from verified sellers worldwide.
            </p>
          </div>
          
          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6 border-y border-outline/50 bg-white/50 backdrop-blur-sm rounded-2xl max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-secondary text-sm font-medium">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              Free Shipping over ₹999
            </div>
            <div className="flex items-center gap-2 text-secondary text-sm font-medium">
              <span className="material-symbols-outlined text-primary text-xl">replay</span>
              Easy Returns
            </div>
            <div className="flex items-center gap-2 text-secondary text-sm font-medium">
              <span className="material-symbols-outlined text-primary text-xl">lock</span>
              Secure Checkout
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-[28px] font-semibold text-on-surface">New Arrivals</h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white border border-outline rounded-xl">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-secondary">Loading curated collection...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  onClick={() => navigate(`/product/${product._id}`)}
                  key={product._id}
                  product={product}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white border border-outline rounded-xl">
              <p className="text-lg text-secondary">No products available at the moment.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const ProductCard = ({ product, formatPrice, onClick }) => {
  // Gather unique color values from variants
  const colors = [];
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((variant) => {
      const attrs = variant.attributes;
      if (!attrs) return;
      let colorVal;
      if (attrs instanceof Map) {
        colorVal = attrs.get("color");
      } else {
        colorVal = attrs["color"];
      }
      if (colorVal && !colors.includes(colorVal)) colors.push(colorVal);
    });
  }

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-outline rounded-[4px] overflow-hidden transition-all duration-300 hover:border-primary flex flex-col"
    >
      <div className="aspect-square bg-surface-dim relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tertiary text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-serif text-[18px] font-semibold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.seller && (
            <p className="text-[13px] text-tertiary mt-1">
              By {product.seller.name || "Brand"}
            </p>
          )}
        </div>
        
        <p className="text-[15px] text-secondary line-clamp-2 mb-4 h-11">
          {product.description}
        </p>

        {/* Color badges */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {colors.map((c) => (
              <span
                key={c}
                className="px-2 py-0.5 text-[11px] rounded bg-surface-dim text-secondary border border-outline"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-outline flex flex-col gap-2">
          <div className="flex items-end gap-3 flex-wrap">
            <span className="font-sans text-lg font-medium text-on-surface">
              {formatPrice(product.price)}
            </span>
            {product.previousPrice && product.price && product.previousPrice.amount !== product.price.amount ? (
              <span className="text-sm text-tertiary line-through pb-0.5">
                {formatPrice(product.previousPrice)}
              </span>
            ) : product.originalPrice && product.price && product.originalPrice.amount > product.price.amount ? (
              <span className="text-sm text-tertiary line-through pb-0.5">
                {formatPrice(product.originalPrice)}
              </span>
            ) : null}
          </div>
          
          <div className="flex justify-between items-center h-6">
            {product.previousPrice && product.price && product.previousPrice.amount !== product.price.amount ? (
              <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${product.price.amount > product.previousPrice.amount ? 'text-error bg-error-container/30' : 'text-primary bg-primary-fixed'}`}>
                {product.price.amount > product.previousPrice.amount ? 'Increased by' : 'Decreased by'} {formatPrice({ amount: Math.abs(product.price.amount - product.previousPrice.amount), currency: product.price.currency })}
              </span>
            ) : product.originalPrice && product.price && product.originalPrice.amount > product.price.amount ? (
              <span className="text-[12px] font-medium text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                Save {formatPrice({ amount: product.originalPrice.amount - product.price.amount, currency: product.price.currency })}
              </span>
            ) : <div></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

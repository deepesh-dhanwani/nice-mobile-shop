import React, { useState } from 'react';
import { X, ShoppingBag, MessageSquare, Check, ShieldCheck, Truck, Star } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, shopPhone = '094144 44908' }) {
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const currentPrice = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const cleanPhone = shopPhone.replace(/\D/g, '');
  const waText = encodeURIComponent(`Hello Vijay Ji (Nice Mobile Shop), I am interested in buying: ${product.title} (Price: ₹${currentPrice}). Is it available at your Bhilwara shop?`);
  const waLink = `https://wa.me/91${cleanPhone}?text=${waText}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Image Container */}
          <div className="product-modal-media">
            <img src={product.image_url} alt={product.title} className="product-modal-img" />
            {discountPercent > 0 && (
              <span className="modal-discount-tag">{discountPercent}% OFF</span>
            )}
          </div>

          {/* Details Container */}
          <div className="product-modal-info">
            <span className="modal-brand-badge">{product.brand}</span>
            <h2 className="modal-title">{product.title}</h2>

            <div className="modal-price-box">
              <span className="modal-current-price">₹{currentPrice.toLocaleString('en-IN')}</span>
              {originalPrice && (
                <span className="modal-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="badge badge-green"><Check size={14} /> In Stock ({product.stock} units left)</span>
              ) : (
                <span className="badge badge-orange">Out of Stock</span>
              )}
              <span className="rating-badge"><Star size={14} fill="#F59E0B" color="#F59E0B" /> 4.9 (Nice Verified)</span>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Product Specifications */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="modal-specs-section">
                <h4>Key Specifications:</h4>
                <div className="specs-table">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="spec-row">
                      <span className="spec-name">{key}:</span>
                      <span className="spec-value">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee Pills */}
            <div className="modal-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={18} className="g-icon" />
                <span>100% Genuine Product</span>
              </div>
              <div className="guarantee-item">
                <Truck size={18} className="g-icon" />
                <span>Free In-Shop Setup</span>
              </div>
            </div>

            {/* Quantity & CTA buttons */}
            <div className="modal-actions-area">
              <div className="qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button 
                className={`btn-primary modal-cart-btn ${addedSuccess ? 'success' : ''}`}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                {addedSuccess ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>

              <a 
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp modal-wa-btn"
              >
                <MessageSquare size={18} /> Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-modal {
          max-width: 820px;
          position: relative;
          padding: 0;
          overflow: hidden;
        }

        .modal-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s ease;
        }
        .modal-close-btn:hover {
          background: rgba(255, 42, 84, 0.8);
        }

        .product-modal-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
        }

        .product-modal-media {
          position: relative;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .product-modal-img {
          max-width: 100%;
          max-height: 380px;
          object-fit: contain;
          border-radius: var(--radius-md);
        }

        .modal-discount-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--accent-orange);
          color: #FFF;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .product-modal-info {
          padding: 32px;
          display: flex;
          flex-direction: column;
          max-height: 85vh;
          overflow-y: auto;
        }

        .modal-brand-badge {
          color: var(--accent-cyan);
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .modal-price-box {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
        }

        .modal-current-price {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent-cyan);
          font-family: var(--font-heading);
        }

        .modal-original-price {
          font-size: 1.1rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .stock-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .rating-badge {
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .modal-description {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .modal-specs-section {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          padding: 16px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }

        .modal-specs-section h4 {
          font-size: 0.9rem;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .specs-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .spec-name {
          color: var(--text-muted);
          font-weight: 500;
        }

        .spec-value {
          color: var(--text-main);
          font-weight: 700;
        }

        .modal-guarantees {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .g-icon {
          color: var(--accent-cyan);
        }

        .modal-actions-area {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: auto;
        }

        .qty-selector {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .qty-selector button {
          width: 38px;
          height: 42px;
          background: none;
          color: var(--text-main);
          font-size: 1.2rem;
          font-weight: 700;
        }

        .qty-selector button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .qty-selector span {
          padding: 0 14px;
          font-weight: 700;
          color: var(--text-main);
        }

        .modal-cart-btn {
          flex: 1;
          height: 44px;
        }

        .modal-cart-btn.success {
          background: var(--grad-emerald);
          color: #FFF;
        }

        .modal-wa-btn {
          height: 44px;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .product-modal-grid {
            grid-template-columns: 1fr;
          }
          .product-modal-media {
            padding: 20px;
          }
          .product-modal-img {
            max-height: 240px;
          }
          .product-modal-info {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

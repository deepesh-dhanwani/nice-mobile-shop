import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  MessageSquare, 
  Sparkles, 
  Filter, 
  Search, 
  Smartphone, 
  Shield, 
  Zap, 
  Headphones, 
  Monitor,
  Tag
} from 'lucide-react';

export default function ProductCatalog({ 
  products, 
  categories, 
  onAddToCart, 
  onSelectProduct,
  searchQuery,
  setSearchQuery,
  shopPhone = '094144 44908'
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Filter products based on Category, Brand & Search Query
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category_slug === selectedCategory || String(p.category_id) === String(selectedCategory);
    const matchesBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(queryLower) || 
      p.description.toLowerCase().includes(queryLower) || 
      p.brand.toLowerCase().includes(queryLower);

    return matchesCategory && matchesBrand && matchesSearch;
  });

  // Extract unique brands for filtering
  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Shield': return <Shield size={16} />;
      case 'Zap': return <Zap size={16} />;
      case 'Headphones': return <Headphones size={16} />;
      case 'Monitor': return <Monitor size={16} />;
      default: return <Smartphone size={16} />;
    }
  };

  const cleanPhone = shopPhone.replace(/\D/g, '');

  return (
    <section id="products" className="section-wrapper">
      <div className="section-header">
        <span className="sub-title"><Sparkles size={14} /> Wholesale & Retail Inventory</span>
        <h2>Shop Mobile Accessories & Mobiles</h2>
        <p>Explore original smartphones, fast chargers, tempered glass, back covers, and computer accessories directly from Nice Mobile Bhilwara.</p>
      </div>

      {/* Category Pills Slider */}
      <div className="category-pills-container">
        <button 
          className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <Tag size={16} /> All Items ({products.length})
        </button>

        {categories.map(cat => (
          <button 
            key={cat.id}
            className={`category-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {getCategoryIcon(cat.icon_name)} {cat.name}
          </button>
        ))}
      </div>

      {/* Filter Bar & Count */}
      <div className="catalog-filter-bar">
        <div className="filter-count">
          Showing <strong>{filteredProducts.length}</strong> items
          {searchQuery && <span> for "<em>{searchQuery}</em>"</span>}
        </div>

        <div className="filter-dropdowns">
          <div className="brand-select-wrapper">
            <Filter size={14} className="filter-icon" />
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="brand-select"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card empty-catalog">
          <Search size={48} className="empty-icon" />
          <h3>No products found!</h3>
          <p>Try searching for a different item name or clear your category filter.</p>
          <button className="btn-primary" onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); setSearchQuery(''); }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const currentPrice = product.discount_price || product.price;
            const originalPrice = product.discount_price ? product.price : null;
            const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
            const waText = encodeURIComponent(`Hello Vijay Ji, I want to inquire/buy: ${product.title} (Price: ₹${currentPrice}). Is this available at Nice Mobile Bhilwara?`);
            const waLink = `https://wa.me/91${cleanPhone}?text=${waText}`;

            return (
              <div key={product.id} className="glass-card product-card">
                <div className="product-media" onClick={() => onSelectProduct(product)}>
                  <img src={product.image_url} alt={product.title} loading="lazy" />
                  
                  {discountPercent > 0 && (
                    <span className="discount-badge">{discountPercent}% OFF</span>
                  )}
                  {product.is_featured === 1 && (
                    <span className="featured-badge">Top Choice</span>
                  )}

                  <div className="quick-view-overlay">
                    <button className="quick-view-btn" title="Quick View">
                      <Eye size={18} /> Quick View
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <div className="card-top-meta">
                    <span className="product-brand">{product.brand}</span>
                    <span className="product-stock-tag">
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <h3 className="product-title" onClick={() => onSelectProduct(product)}>
                    {product.title}
                  </h3>

                  <p className="product-short-desc">{product.description}</p>

                  <div className="product-price-row">
                    <div className="price-box">
                      <span className="price-current">₹{currentPrice.toLocaleString('en-IN')}</span>
                      {originalPrice && (
                        <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="product-actions">
                    <button 
                      className="btn-primary card-add-btn"
                      onClick={() => onAddToCart({ ...product, quantity: 1 })}
                      title="Add to Cart"
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </button>

                    <a 
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp card-wa-btn"
                      title="Order on WhatsApp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .category-pills-container {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .category-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .category-pill:hover, .category-pill.active {
          background: var(--grad-primary);
          color: #090d16;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
          font-weight: 700;
        }

        .catalog-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .filter-count {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .filter-count strong {
          color: var(--text-main);
        }

        .brand-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .brand-select {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 6px 14px 6px 30px;
          border-radius: var(--radius-sm);
          font-family: var(--font-main);
          font-size: 0.88rem;
          outline: none;
        }

        .empty-catalog {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-catalog h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .empty-catalog p {
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .product-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .product-media {
          position: relative;
          height: 220px;
          background: #060911;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          cursor: pointer;
        }

        .product-media img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-media img {
          transform: scale(1.06);
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--accent-orange);
          color: #FFF;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          z-index: 2;
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--accent-cyan);
          color: #090d16;
          font-weight: 800;
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          z-index: 2;
        }

        .quick-view-overlay {
          position: absolute;
          inset: 0;
          background: rgba(9, 13, 22, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .product-card:hover .quick-view-overlay {
          opacity: 1;
        }

        .quick-view-btn {
          background: #FFF;
          color: #090d16;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .product-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .product-brand {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          font-weight: 700;
          text-transform: uppercase;
        }

        .product-stock-tag {
          font-size: 0.72rem;
          color: var(--accent-green);
          font-weight: 600;
        }

        .product-title {
          font-size: 1.05rem;
          margin-bottom: 8px;
          line-height: 1.35;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-title:hover {
          color: var(--accent-cyan);
        }

        .product-short-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price-row {
          margin-top: auto;
          margin-bottom: 16px;
        }

        .price-current {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--accent-cyan);
          font-family: var(--font-heading);
        }

        .price-original {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 8px;
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }

        .card-add-btn {
          flex: 1;
          font-size: 0.88rem;
          padding: 9px 12px;
        }

        .card-wa-btn {
          padding: 9px 12px;
        }
      `}</style>
    </section>
  );
}

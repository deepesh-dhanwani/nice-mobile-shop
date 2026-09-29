import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import RepairServiceSection from './components/RepairServiceSection';
import EMitraServices from './components/EMitraServices';
import CartDrawer from './components/CartDrawer';
import LocationAndContact from './components/LocationAndContact';
import AdminPanel from './components/AdminPanel';
import { MapPin } from 'lucide-react';

export default function App() {
  // Page View Switcher: 'store' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'store';
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState({
    shop_name: 'Nice Mobile Bhilwara',
    owner_name: 'Vijay Chandak',
    phone_primary: '88905 21023',
    phone_secondary: '094144 44908',
    address: 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara, Rajasthan 311001',
    timing: '9:00 AM - 9:00 PM (Monday to Saturday)'
  });

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nice_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modal Toggles
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showRepairBooking, setShowRepairBooking] = useState(false);
  const [showRepairTracker, setShowRepairTracker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    localStorage.setItem('nice_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.removeItem('nice_admin_token');
    localStorage.removeItem('nice_admin_user');
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const [catRes, prodRes, infoRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/shop/info')
      ]);

      const catData = await catRes.json();
      const prodData = await prodRes.json();
      const infoData = await infoRes.json();

      if (catData.success) setCategories(catData.categories);
      if (prodData.success) setProducts(prodData.products);
      if (infoData.success) setShopInfo(infoData.settings);
    } catch (err) {
      console.error('Error fetching initial shop data:', err);
    }
  };

  // Cart Handlers
  const handleAddToCart = (productToAdd) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productToAdd.id);
      if (existing) {
        return prev.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + (productToAdd.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...productToAdd, quantity: productToAdd.quantity || 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    setCartItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // IF CURRENT VIEW IS STANDALONE ADMIN PAGE
  if (currentView === 'admin') {
    return (
      <AdminPanel 
        onBackToStore={() => {
          setCurrentView('store');
          window.history.pushState({}, '', '/');
        }}
        onRefreshData={loadStoreData}
        categories={categories}
        products={products}
        shopInfo={shopInfo}
      />
    );
  }

  // CUSTOMER STOREFRONT VIEW
  return (
    <div className="app-container">
      {/* Header & Navigation */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={() => setShowCart(true)}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.history.pushState({}, '', '/admin');
        }}
        onOpenRepairTracker={() => setShowRepairTracker(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shopInfo={shopInfo}
      />

      {/* Hero Section */}
      <Hero 
        onOpenRepairModal={() => setShowRepairBooking(true)}
        onScrollToProducts={() => {
          setActiveSection('products');
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }}
        shopInfo={shopInfo}
      />

      {/* Main E-Commerce Product Catalog */}
      <ProductCatalog 
        products={products}
        categories={categories}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shopPhone={shopInfo.phone_primary}
      />

      {/* Repair Services Showcase & Tracker */}
      <RepairServiceSection 
        showBookingModal={showRepairBooking}
        onCloseBookingModal={() => setShowRepairBooking(false)}
        showTrackerModal={showRepairTracker}
        onCloseTrackerModal={() => setShowRepairTracker(false)}
        shopPhone={shopInfo.phone_primary}
      />

      {/* E-Mitra & Digital Govt Services */}
      <EMitraServices shopPhone={shopInfo.phone_primary} />

      {/* Google Maps Location & Store Info */}
      <LocationAndContact shopInfo={shopInfo} />

      {/* MODALS */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          shopPhone={shopInfo.phone_primary}
        />
      )}

      {/* Cart Drawer Overlay */}
      <CartDrawer 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        shopPhone={shopInfo.phone_primary}
      />

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={shopInfo.logo_url || '/logo.png'} alt="Nice Mobile Bhilwara Logo" className="footer-logo-img" />
            <h3>{(shopInfo.shop_name || 'Nice Mobile Bhilwara').toUpperCase()}</h3>
            <p>Owned & Operated by <strong>Vijay Chandak</strong></p>
            <p className="footer-addr"><MapPin size={14} /> Love Kush Vyayamshala Ke Pass, Pansal Rd, Labour Colony, Bhilwara</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#products">Mobile Accessories</a>
            <a href="#repair">Device Repairing</a>
            <a href="#emitra">E-Mitra Services</a>
            <a href="#location">Shop Map & Address</a>
            <button className="footer-admin-link" onClick={() => setCurrentView('admin')}>🔐 Admin Panel</button>
          </div>

          <div className="footer-contact">
            <h4>Contact Shop</h4>
            <p>📞 Phone: <a href={`tel:${shopInfo.phone_primary.replace(/\D/g, '')}`}>{shopInfo.phone_primary}</a></p>
            <p>📱 WhatsApp: <a href={`https://wa.me/91${shopInfo.phone_primary.replace(/\D/g, '')}`}>{shopInfo.phone_secondary}</a></p>
            <p>⏰ Timing: {shopInfo.timing}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Nice Mobile Bhilwara. All rights reserved. | Owner: Vijay Chandak</p>
        </div>
      </footer>

      <style>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .footer-admin-link {
          background: none;
          color: var(--accent-cyan);
          font-weight: 700;
          font-size: 0.88rem;
          text-align: left;
          padding: 0;
          margin-top: 4px;
        }

        .footer-container {
          background: #060911;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
          padding: 50px 20px 20px;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-logo-img {
          height: 46px;
          width: auto;
          object-fit: contain;
          border-radius: 6px;
          background: #FFF;
          padding: 2px 6px;
          margin-bottom: 12px;
        }

        .footer-brand h3 {
          font-family: var(--font-heading);
          color: var(--accent-cyan);
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .footer-brand p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 6px;
        }

        .footer-addr {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-links h4, .footer-contact h4 {
          font-size: 1rem;
          color: var(--text-main);
          margin-bottom: 14px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-links a {
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--accent-cyan);
        }

        .footer-contact p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .footer-contact a {
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          text-align: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}

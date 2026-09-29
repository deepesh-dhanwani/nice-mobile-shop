import React, { useState } from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  Search, 
  PhoneCall, 
  MapPin, 
  Menu, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  onOpenAdmin, 
  onOpenRepairTracker,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  shopInfo
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phonePrimary = shopInfo?.phone_primary || '094144 44908';
  const announcement = shopInfo?.banner_announcement || '🔥 Special Offer: Free Tempered Glass & Cover with Every Mobile Repair! Visit Nice Mobile Bhilwara today.';

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky-header">
      {/* Top Announcement Ticker */}
      <div className="ticker-banner">
        <div className="ticker-content">
          <span>{announcement}</span>
          <span className="divider">•</span>
          <span>Call Shop Owner Vijay Chandak: <strong>{phonePrimary}</strong></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar-container">
        <div className="nav-wrapper">
          {/* Logo & Branding */}
          <div className="logo-brand" onClick={() => handleNavClick('hero')}>
            <img 
              src={shopInfo?.logo_url || '/logo.png'} 
              alt="Nice Mobile Bhilwara Logo" 
              className="brand-logo-img" 
            />
            <div className="logo-text">
              <span className="brand-title">{shopInfo?.shop_name ? shopInfo.shop_name.toUpperCase() : 'NICE MOBILE BHILWARA'}</span>
              <span className="brand-sub">BHILWARA • Repair & Wholesale Accessories</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="search-box-desktop">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search mobiles, covers, chargers, earbuds..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Nav Links Desktop */}
          <ul className="nav-links-desktop">
            <li>
              <button 
                className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}
                onClick={() => handleNavClick('products')}
              >
                Shop
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeSection === 'repair' ? 'active' : ''}`}
                onClick={() => handleNavClick('repair')}
              >
                <Wrench size={16} /> Repairs
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeSection === 'emitra' ? 'active' : ''}`}
                onClick={() => handleNavClick('emitra')}
              >
                <FileText size={16} /> E-Mitra
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${activeSection === 'location' ? 'active' : ''}`}
                onClick={() => handleNavClick('location')}
              >
                <MapPin size={16} /> Location
              </button>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="nav-actions">
            {/* Live Repair Job Tracker Button */}
            <button 
              className="action-btn tracker-btn"
              onClick={onOpenRepairTracker}
              title="Track Repair Job Status"
            >
              <Wrench size={18} />
              <span className="btn-text">Track Status</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button 
              className="action-btn cart-btn"
              onClick={onOpenCart}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Admin Panel Trigger */}
            <button 
              className="action-btn admin-btn"
              onClick={onOpenAdmin}
              title="Admin Panel Login"
            >
              <UserCheck size={18} />
              <span className="btn-text">Admin</span>
            </button>

            {/* Direct Call Button */}
            <a 
              href={`tel:${phonePrimary.replace(/\s+/g, '')}`} 
              className="action-btn call-btn"
              title="Call Shop"
            >
              <PhoneCall size={18} />
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown glass-card">
            <div className="mobile-search">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="mobile-links">
              <button onClick={() => handleNavClick('products')}>📱 Store Products</button>
              <button onClick={() => handleNavClick('repair')}>🛠 Mobile & Computer Repairing</button>
              <button onClick={() => handleNavClick('emitra')}>📄 E-Mitra Services</button>
              <button onClick={() => handleNavClick('location')}>📍 Shop Address & Map</button>
              <button onClick={() => { onOpenRepairTracker(); setMobileMenuOpen(false); }}>🔍 Track Repair Job</button>
              <button onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}>🔐 Admin Panel</button>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(11, 15, 25, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border-color);
        }

        .nav-wrapper {
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .brand-logo-img {
          height: 48px;
          width: auto;
          object-fit: contain;
          border-radius: 6px;
          background: #FFF;
          padding: 2px 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.25rem;
          color: #FFFFFF;
          line-height: 1.1;
        }

        .brand-highlight {
          color: var(--accent-cyan);
        }

        .brand-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .search-box-desktop {
          position: relative;
          flex: 1;
          max-width: 360px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          width: 18px;
          height: 18px;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          padding: 8px 16px 8px 42px;
          color: var(--text-main);
          font-size: 0.88rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          background: rgba(255, 255, 255, 0.09);
        }

        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 20px;
          list-style: none;
        }

        .nav-link {
          background: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--accent-cyan);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn {
          height: 38px;
          padding: 0 14px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          position: relative;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--accent-cyan);
        }

        .tracker-btn {
          color: var(--accent-amber);
          border-color: rgba(245, 158, 11, 0.3);
          background: rgba(245, 158, 11, 0.08);
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-rose);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 800;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .call-btn {
          background: var(--grad-accent);
          color: #FFF;
          border: none;
          padding: 0 12px;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          color: var(--text-main);
          padding: 6px;
        }

        .mobile-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 12px;
          right: 12px;
          padding: 16px;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-links button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 12px;
          border-radius: 10px;
          text-align: left;
          font-weight: 600;
          font-size: 0.92rem;
        }

        @media (max-width: 992px) {
          .search-box-desktop, .nav-links-desktop, .btn-text {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}

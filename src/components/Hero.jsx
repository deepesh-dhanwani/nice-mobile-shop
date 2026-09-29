import React from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Award,
  Zap
} from 'lucide-react';

export default function Hero({ onOpenRepairModal, onScrollToProducts, shopInfo }) {
  const phonePrimary = shopInfo?.phone_primary || '094144 44908';
  const phoneSecondary = shopInfo?.phone_secondary || '88905 21023';
  const ownerName = shopInfo?.owner_name || 'Vijay Chandak';
  const address = shopInfo?.address || 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara';
  const timing = shopInfo?.timing || '9:00 AM - 9:00 PM (Mon-Sat)';

  return (
    <section id="hero" className="hero-section">
      <div className="hero-grid">
        {/* Left Column: Headlines & CTAs */}
        <div className="hero-content">
          <div className="badge badge-cyan hero-badge">
            <Sparkles size={14} /> #1 MOBILE & REPAIR SHOP IN BHILWARA
          </div>

          <h1 className="hero-title">
            Nice Mobile Bhilwara <br />
            <span className="gradient-text">Repair & Accessories</span>
          </h1>

          <p className="hero-description">
            Managed by <strong>{ownerName}</strong>. Your trusted destination for fast 
            <strong> Mobile & Laptop Repairing</strong>, <strong>Wholesale Accessories</strong>, 
            original chargers, covers, screen guards, and <strong>E-Mitra Services</strong> in Bhilwara!
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary hero-btn" onClick={onScrollToProducts}>
              <ShoppingBag size={18} /> Explore Products
            </button>

            <button className="btn-secondary hero-btn repair-cta" onClick={onOpenRepairModal}>
              <Wrench size={18} /> Book Repairing
            </button>

            <a 
              href={`https://wa.me/91${phonePrimary.replace(/\D/g, '')}?text=Hello%20Vijay%20Ji,%20I%20want%20to%20inquire%20about%20mobile%20repair%20/%20accessories.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp hero-btn"
            >
              <MessageSquare size={18} /> WhatsApp Inquiry
            </a>
          </div>

          {/* Feature Highlights Grid */}
          <div className="hero-features-grid">
            <div className="feature-item">
              <CheckCircle2 className="feature-icon" />
              <span>Same-Day Display & Battery Repair</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 className="feature-icon" />
              <span>100% Original Spare Parts</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 className="feature-icon" />
              <span>Wholesale Accessories Rates</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 className="feature-icon" />
              <span>Govt. E-Mitra Portal Available</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Card & Store Info Card */}
        <div className="hero-visual">
          <div className="glass-card store-card">
            <div className="store-card-header">
              <img 
                src={shopInfo?.logo_url || '/logo.png'} 
                alt="Nice Mobile Bhilwara Logo" 
                className="hero-logo-img" 
              />
              <div className="store-card-title">
                <h3>Nice Mobile Bhilwara</h3>
                <span className="owner-tag">Prop: {ownerName}</span>
              </div>
              <span className="live-status-pill">
                <span className="green-dot"></span> Open Now
              </span>
            </div>

            <div className="store-info-list">
              <div className="info-row">
                <PhoneCall className="info-icon" />
                <div>
                  <span className="info-label">Call & Contact:</span>
                  <div className="phone-numbers">
                    <a href={`tel:${phonePrimary.replace(/\D/g, '')}`}>{phonePrimary}</a>
                    <span className="dot">•</span>
                    <a href={`tel:${phoneSecondary.replace(/\D/g, '')}`}>{phoneSecondary}</a>
                  </div>
                </div>
              </div>

              <div className="info-row">
                <MapPin className="info-icon" />
                <div>
                  <span className="info-label">Shop Address:</span>
                  <p className="info-val">{address}</p>
                </div>
              </div>

              <div className="info-row">
                <Clock className="info-icon" />
                <div>
                  <span className="info-label">Working Hours:</span>
                  <p className="info-val">{timing}</p>
                </div>
              </div>

              <div className="info-row">
                <Zap className="info-icon" />
                <div>
                  <span className="info-label">Specialties:</span>
                  <p className="info-val">Screen Display, Battery, Laptop SSD, E-Mitra, Covers, Earbuds</p>
                </div>
              </div>
            </div>

            <div className="card-footer-cta">
              <a 
                href={`tel:${phonePrimary.replace(/\D/g, '')}`} 
                className="btn-primary full-width-btn"
              >
                <PhoneCall size={16} /> Call Vijay Chandak ({phonePrimary})
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 50px 20px 70px;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.9fr;
          gap: 40px;
          align-items: center;
        }

        .hero-badge {
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: 3.2rem;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 30px;
        }

        .hero-description strong {
          color: var(--text-main);
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 35px;
        }

        .hero-btn {
          padding: 12px 24px;
          font-size: 0.98rem;
        }

        .repair-cta {
          border-color: rgba(255, 94, 54, 0.4);
          color: var(--accent-orange);
        }

        .repair-cta:hover {
          background: rgba(255, 94, 54, 0.15);
        }

        .hero-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          border-top: 1px solid var(--border-color);
          padding-top: 25px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-main);
          font-weight: 500;
        }

        .feature-icon {
          color: var(--accent-green);
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Right Card Styles */
        .store-card {
          padding: 28px;
          border-radius: var(--radius-lg);
          background: linear-gradient(145deg, rgba(18, 24, 38, 0.9) 0%, rgba(10, 15, 26, 0.95) 100%);
        }

        .store-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .hero-logo-img {
          height: 50px;
          width: auto;
          object-fit: contain;
          border-radius: 8px;
          background: #FFF;
          padding: 3px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .store-card-title h3 {
          font-size: 1.3rem;
          color: var(--text-main);
        }

        .owner-tag {
          font-size: 0.82rem;
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .live-status-pill {
          margin-left: auto;
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-green);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .green-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-green);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-green);
        }

        .store-info-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .info-icon {
          color: var(--accent-cyan);
          width: 20px;
          height: 20px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .info-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
        }

        .phone-numbers {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--text-main);
          font-size: 1.05rem;
        }

        .phone-numbers a {
          color: var(--accent-cyan);
          transition: color 0.2s ease;
        }

        .phone-numbers a:hover {
          color: var(--accent-blue);
          text-decoration: underline;
        }

        .info-val {
          font-size: 0.92rem;
          color: var(--text-main);
          font-weight: 500;
        }

        .full-width-btn {
          width: 100%;
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .hero-title {
            font-size: 2.4rem;
          }
          .hero-features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .hero-section {
            padding: 24px 14px 20px;
          }
          .hero-title {
            font-size: clamp(1.8rem, 8vw, 2.2rem);
            line-height: 1.25;
            margin-bottom: 12px;
          }
          .hero-description {
            font-size: 0.92rem;
            line-height: 1.5;
            margin-bottom: 20px;
          }
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .hero-btn {
            width: 100%;
            padding: 12px 18px;
            font-size: 0.95rem;
          }
          .store-card {
            padding: 18px;
          }
          .phone-numbers {
            font-size: 0.95rem;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  );
}

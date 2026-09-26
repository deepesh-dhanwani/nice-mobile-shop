import React from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  User, 
  Navigation, 
  MessageSquare, 
  Store,
  Sparkles
} from 'lucide-react';

export default function LocationAndContact({ shopInfo }) {
  const phonePrimary = shopInfo?.phone_primary || '094144 44908';
  const phoneSecondary = shopInfo?.phone_secondary || '88905 21023';
  const ownerName = shopInfo?.owner_name || 'Vijay Chandak';
  const address = shopInfo?.address || 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara, Rajasthan 311001';
  const mapsUrl = shopInfo?.maps_url || 'https://maps.google.com/maps?q=Nice+Mobile+Shop+Pansal+Road+Bhilwara';
  const timing = shopInfo?.timing || '9:00 AM - 9:00 PM (Monday to Saturday)';

  const mapEmbedSrc = "https://maps.google.com/maps?q=Pansal+Road+Jawahar+Nagar+Bhilwara+Rajasthan+311001&t=&z=16&ie=UTF-8&iwloc=&output=embed";

  const cleanPhone = phonePrimary.replace(/\D/g, '');

  return (
    <section id="location" className="section-wrapper">
      <div className="section-header">
        <span className="sub-title"><MapPin size={14} /> Visit Our Store</span>
        <h2>Shop Location & Contact Details</h2>
        <p>Drop by Nice Mobile Shop at Pansal Road, Bhilwara for fast device repairs, accessories purchase, or E-Mitra services.</p>
      </div>

      <div className="location-grid">
        {/* Left Info Card */}
        <div className="glass-card contact-details-card">
          <div className="card-badge badge-cyan">
            <Store size={14} /> MAIN BRANCH
          </div>
          <h3>Nice Mobile Shop</h3>
          <p className="owner-subtitle"><User size={14} /> Owner: <strong>{ownerName}</strong></p>

          <div className="contact-items-stack">
            <div className="contact-item">
              <MapPin className="c-icon" />
              <div>
                <span className="c-label">Store Address:</span>
                <p className="c-val">{address}</p>
              </div>
            </div>

            <div className="contact-item">
              <PhoneCall className="c-icon" />
              <div>
                <span className="c-label">Phone Numbers:</span>
                <div className="c-phones">
                  <a href={`tel:${phonePrimary.replace(/\D/g, '')}`}>{phonePrimary}</a>
                  <span className="dot">•</span>
                  <a href={`tel:${phoneSecondary.replace(/\D/g, '')}`}>{phoneSecondary}</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <Clock className="c-icon" />
              <div>
                <span className="c-label">Store Timings:</span>
                <p className="c-val">{timing}</p>
                <span className="timing-sub">Closes 9:00 PM • Opens 9:00 AM Sat</span>
              </div>
            </div>
          </div>

          <div className="contact-actions-row">
            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary full-width-btn"
            >
              <Navigation size={16} /> Open in Google Maps
            </a>

            <a 
              href={`https://wa.me/91${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp full-width-btn"
            >
              <MessageSquare size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Right Embedded Google Map */}
        <div className="glass-card map-frame-card">
          <iframe 
            title="Nice Mobile Shop Google Map Location"
            src={mapEmbedSrc}
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: 'var(--radius-md)', minHeight: '380px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <style>{`
        .location-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 28px;
        }

        .contact-details-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .card-badge {
          margin-bottom: 12px;
          align-self: flex-start;
        }

        .contact-details-card h3 {
          font-size: 1.8rem;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .owner-subtitle {
          font-size: 0.95rem;
          color: var(--accent-cyan);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-items-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .contact-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .c-icon {
          color: var(--accent-cyan);
          width: 22px;
          height: 22px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .c-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
        }

        .c-val {
          font-size: 0.95rem;
          color: var(--text-main);
          font-weight: 500;
          line-height: 1.5;
        }

        .timing-sub {
          font-size: 0.8rem;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .c-phones {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .c-phones a {
          color: var(--accent-cyan);
        }

        .c-phones a:hover {
          text-decoration: underline;
        }

        .contact-actions-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .map-frame-card {
          padding: 8px;
          overflow: hidden;
          background: #000;
        }

        @media (max-width: 992px) {
          .location-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

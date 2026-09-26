import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Globe, 
  CheckCircle, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function EMitraServices({ shopPhone = '094144 44908' }) {
  const cleanPhone = shopPhone.replace(/\D/g, '');

  const emitraList = [
    {
      icon: <FileText size={32} className="emitra-icon" />,
      title: 'Aadhaar & PAN Card Services',
      desc: 'PAN Card new application & corrections, PVC plastic card print, Aadhaar update assistance.',
      category: 'Identity Services'
    },
    {
      icon: <Globe size={32} className="emitra-icon" />,
      title: 'Govt. Forms & Certificates',
      desc: 'Bonafide certificate, Caste certificate, Income certificate, Police clearance, & Online Job Application forms.',
      category: 'Govt Services'
    },
    {
      icon: <CreditCard size={32} className="emitra-icon" />,
      title: 'Utility Bills & Recharges',
      desc: 'Instant electricity bill payment, water bill, DTH recharge, FASTag recharge, & mobile bills.',
      category: 'Bill Payments'
    },
    {
      icon: <Send size={32} className="emitra-icon" />,
      title: 'Money Transfer & Mini ATM',
      desc: 'Instant domestic money transfer, Aadhaar Enabled Payment (AEPS) cash withdrawal, & bank balance inquiry.',
      category: 'Banking Services'
    }
  ];

  return (
    <section id="emitra" className="section-wrapper">
      <div className="glass-card emitra-container-card">
        <div className="emitra-header">
          <div className="badge badge-orange">
            <Sparkles size={14} /> AUTHORIZED E-MITRA CENTER
          </div>
          <h2>Rajasthan Govt. E-Mitra & Digital Services</h2>
          <p>Complete all your government forms, identity cards, bill payments, and money transfer work right here at Nice Mobile Shop Bhilwara.</p>
        </div>

        <div className="emitra-services-grid">
          {emitraList.map((item, idx) => (
            <div key={idx} className="glass-card emitra-card">
              <div className="emitra-card-head">
                {item.icon}
                <span className="badge badge-cyan">{item.category}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <a 
                href={`https://wa.me/91${cleanPhone}?text=Hello%20Vijay%20Ji,%20I%20have%20an%20inquiry%20regarding%20E-Mitra%20service:%20${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="emitra-inquire-btn"
              >
                Inquire Service <MessageSquare size={14} />
              </a>
            </div>
          ))}
        </div>

        <div className="emitra-footer-banner">
          <div className="banner-info">
            <ShieldCheck size={24} className="banner-icon" />
            <div>
              <h4>Fast & Reliable Service Guaranteed</h4>
              <p>Visit Vijay Chandak at Love Kush Vyayamshala Ke Pass, Pansal Road, Bhilwara.</p>
            </div>
          </div>
          <a 
            href={`tel:${cleanPhone}`} 
            className="btn-primary"
          >
            Call E-Mitra Desk ({shopPhone})
          </a>
        </div>
      </div>

      <style>{`
        .emitra-container-card {
          padding: 40px;
          background: linear-gradient(135deg, rgba(255, 94, 54, 0.05) 0%, rgba(18, 24, 38, 0.95) 100%);
          border-color: rgba(255, 94, 54, 0.25);
        }

        .emitra-header {
          text-align: center;
          margin-bottom: 35px;
        }

        .emitra-header .badge {
          margin-bottom: 12px;
        }

        .emitra-header h2 {
          font-size: 2rem;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .emitra-header p {
          color: var(--text-muted);
          max-width: 620px;
          margin: 0 auto;
          font-size: 0.95rem;
        }

        .emitra-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .emitra-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .emitra-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .emitra-icon {
          color: var(--accent-orange);
        }

        .emitra-card h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .emitra-card p {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 18px;
        }

        .emitra-inquire-btn {
          margin-top: auto;
          color: var(--accent-orange);
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .emitra-inquire-btn:hover {
          text-decoration: underline;
        }

        .emitra-footer-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          padding: 20px 28px;
          border-radius: var(--radius-md);
        }

        .banner-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .banner-icon {
          color: var(--accent-green);
        }

        .banner-info h4 {
          font-size: 1.05rem;
          margin-bottom: 2px;
        }

        .banner-info p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .emitra-footer-banner {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

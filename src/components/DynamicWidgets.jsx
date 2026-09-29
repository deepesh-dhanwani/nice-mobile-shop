import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, ArrowUp, X, CheckCircle, Clock, Zap } from 'lucide-react';

export default function DynamicWidgets({ shopPhone = '88905 21023' }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeToastIndex, setActiveToastIndex] = useState(0);
  const [toastVisible, setToastVisible] = useState(true);

  const cleanPhone = shopPhone.replace(/\D/g, '');

  // Live dynamic activity notifications (social proof)
  const activities = [
    { text: 'Rohit S. just booked Screen Repair for Redmi Note 13', time: '2m ago', icon: '🛠️' },
    { text: 'Aman J. ordered Fast 65W GaN Charger (Pansal Rd, Bhilwara)', time: '4m ago', icon: '⚡' },
    { text: 'Pooja K. purchased boAt Airdopes 141 with warranty', time: '7m ago', icon: '🎧' },
    { text: 'Vijay Ji marked Repair NICE-REP-4198 Ready for pickup', time: 'Just now', icon: '✓' },
    { text: '16 customers actively browsing repair services & accessories', time: 'Live', icon: '🟢' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Rotate toast every 10 seconds
    const interval = setInterval(() => {
      setToastVisible(false);
      setTimeout(() => {
        setActiveToastIndex(prev => (prev + 1) % activities.length);
        setToastVisible(true);
      }, 600);
    }, 9500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentActivity = activities[activeToastIndex];

  return (
    <>
      {/* 1. Dynamic Live Activity Notification Toast (Bottom-Left) */}
      {toastVisible && (
        <div className="dynamic-activity-toast glass-card">
          <button 
            className="toast-close-btn" 
            onClick={() => setToastVisible(false)}
            aria-label="Dismiss notice"
          >
            <X size={12} />
          </button>
          <div className="toast-icon-badge">
            <span>{currentActivity.icon}</span>
          </div>
          <div className="toast-text-box">
            <p className="toast-message">{currentActivity.text}</p>
            <span className="toast-time"><Clock size={10} /> {currentActivity.time} • Nice Mobile Bhilwara</span>
          </div>
        </div>
      )}

      {/* 2. Floating Quick Contact & Back-to-Top Actions (Bottom-Right) */}
      <div className="floating-actions-dock">
        {/* WhatsApp Button with pulsing ripple */}
        <a
          href={`https://wa.me/91${cleanPhone}?text=Hello%20Vijay%20Ji%20(Nice%20Mobile%20Bhilwara),%20I%20have%20an%20inquiry%20regarding%20mobile%20repair%20/%20accessories.`}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-btn dock-whatsapp"
          title="Chat on WhatsApp with Vijay Chandak"
          aria-label="WhatsApp Inquiry"
        >
          <span className="dock-ripple"></span>
          <MessageSquare size={22} />
          <span className="dock-tooltip">WhatsApp Us</span>
        </a>

        {/* Direct Phone Call Button */}
        <a
          href={`tel:${cleanPhone}`}
          className="dock-btn dock-call"
          title="Call Vijay Chandak: 88905 21023"
          aria-label="Call Shop"
        >
          <PhoneCall size={20} />
          <span className="dock-tooltip">Call Now</span>
        </a>

        {/* Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="dock-btn dock-top"
            title="Scroll to Top"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>

      <style>{`
        /* Floating Actions Dock */
        .floating-actions-dock {
          position: fixed;
          bottom: 22px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          z-index: 9999;
        }

        .dock-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .dock-btn:hover {
          transform: scale(1.1) translateY(-3px);
        }

        .dock-whatsapp {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          box-shadow: 0 6px 22px rgba(16, 185, 129, 0.45);
        }

        .dock-ripple {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #10B981;
          animation: dockPulse 2s infinite ease-out;
          pointer-events: none;
        }

        @keyframes dockPulse {
          0% { transform: scale(0.95); opacity: 0.9; }
          100% { transform: scale(1.45); opacity: 0; }
        }

        .dock-call {
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
        }

        .dock-top {
          background: rgba(19, 27, 46, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          color: var(--accent-cyan);
          cursor: pointer;
        }
        .dock-top:hover {
          background: var(--accent-cyan);
          color: #0B0F19;
        }

        .dock-tooltip {
          position: absolute;
          right: 60px;
          background: #0B0F19;
          color: #FFF;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transform: translateX(10px);
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .dock-btn:hover .dock-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        /* Activity Toast */
        .dynamic-activity-toast {
          position: fixed;
          bottom: 22px;
          left: 20px;
          max-width: 320px;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 9998;
          animation: slideUpToast 0.35s ease-out;
        }

        @keyframes slideUpToast {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-icon-badge {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .toast-text-box {
          flex: 1;
          min-width: 0;
        }

        .toast-message {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
          margin-bottom: 2px;
          white-space: normal;
        }

        .toast-time {
          font-size: 0.7rem;
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .toast-close-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
        }
        .toast-close-btn:hover {
          color: #FFF;
        }

        @media (max-width: 600px) {
          .floating-actions-dock {
            bottom: 16px;
            right: 14px;
            gap: 10px;
          }
          .dock-btn {
            width: 44px;
            height: 44px;
          }
          .dock-tooltip {
            display: none;
          }
          .dynamic-activity-toast {
            bottom: 74px;
            left: 12px;
            right: 12px;
            max-width: none;
            padding: 8px 12px;
          }
          .toast-message {
            font-size: 0.76rem;
          }
        }
      `}</style>
    </>
  );
}

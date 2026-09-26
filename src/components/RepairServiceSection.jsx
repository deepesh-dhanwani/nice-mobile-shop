import React, { useState } from 'react';
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  ShieldAlert, 
  Cpu, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  ArrowRight,
  PhoneCall,
  X,
  MessageSquare
} from 'lucide-react';

export default function RepairServiceSection({ 
  showBookingModal, 
  onCloseBookingModal, 
  showTrackerModal,
  onCloseTrackerModal,
  shopPhone = '094144 44908'
}) {
  // Booking Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    device_type: 'Mobile',
    brand: 'Samsung',
    model: '',
    issue_description: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Tracker State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  const servicesList = [
    {
      icon: <Smartphone size={28} className="srv-icon" />,
      title: 'Mobile Screen & Display Repair',
      desc: 'Original AMOLED, Curved Glass, & LCD Screen replacement for Samsung, iPhone, Realme, Vivo, Oppo, Xiaomi.',
      tag: 'Fast 1-Hour Service'
    },
    {
      icon: <BatteryCharging size={28} className="srv-icon" />,
      title: 'Battery & Charging Port Fixing',
      desc: 'Fix fast battery drain, loose Type-C ports, and slow charging issues with genuine high-capacity batteries.',
      tag: 'Original Battery'
    },
    {
      icon: <ShieldAlert size={28} className="srv-icon" />,
      title: 'Water & Liquid Damage Recovery',
      desc: 'Deep ultrasonic cleaning, short-circuit removal, motherboard IC replacement, and data preservation.',
      tag: 'Expert Tech'
    },
    {
      icon: <Laptop size={28} className="srv-icon" />,
      title: 'Laptop Repair & SSD Speedup',
      desc: 'Laptop screen repair, keyboard replacement, high-speed NVMe SSD & RAM upgrade, Windows OS setup.',
      tag: '10x Speed Booster'
    },
    {
      icon: <Cpu size={28} className="srv-icon" />,
      title: 'Software Flashing & Unlocking',
      desc: 'Fix hanging logo, boot loops, pattern lock removal, official software updates & backup restoration.',
      tag: '100% Safe'
    },
    {
      icon: <Wrench size={28} className="srv-icon" />,
      title: 'Speaker, Mic & Camera Fixing',
      desc: 'Replace low sound ear speakers, mic noise issues, blurred camera lenses, and broken side keys.',
      tag: 'Genuine Parts'
    }
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setBookingResult(data);
      } else {
        alert(data.error || 'Failed to submit repair booking.');
      }
    } catch (err) {
      alert('Error connecting to repair booking service.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await fetch(`/api/repairs/track/${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (data.success && data.repairs.length > 0) {
        setTrackResult(data.repairs[0]);
      } else {
        setTrackError(data.message || 'No job card found for this ID/Phone number.');
      }
    } catch (err) {
      setTrackError('Could not connect to tracking server.');
    } finally {
      setTrackLoading(false);
    }
  };

  const copyJobCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Received': return 1;
      case 'Diagnosing': return 2;
      case 'In Repair': return 3;
      case 'Ready': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <section id="repair" className="section-wrapper">
      <div className="section-header">
        <span className="sub-title"><Wrench size={14} /> Professional Repair Center</span>
        <h2>Mobile & Computer Repairing Services</h2>
        <p>Get your smartphone or laptop repaired by certified technicians with genuine components and live status tracking.</p>
      </div>

      {/* Tracker Callout Banner */}
      <div className="glass-card tracker-callout-banner">
        <div className="callout-left">
          <Clock size={32} className="callout-icon" />
          <div>
            <h3>Already handed over your device for repair?</h3>
            <p>Track your device repair progress, technician diagnostic notes, and final cost in real time!</p>
          </div>
        </div>
        <div className="callout-buttons">
          <button className="btn-primary" onClick={() => handleTrackSubmit({ preventDefault: () => {} })}>
            <Search size={16} /> Track Status Now
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {servicesList.map((srv, idx) => (
          <div key={idx} className="glass-card service-card">
            <div className="service-card-top">
              {srv.icon}
              <span className="badge badge-cyan">{srv.tag}</span>
            </div>
            <h3>{srv.title}</h3>
            <p>{srv.desc}</p>
            <button className="service-book-btn" onClick={() => setShowBookingModal(true)}>
              Book Repair <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* REPAIR BOOKING MODAL */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={onCloseBookingModal}>
          <div className="modal-container repair-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onCloseBookingModal}>
              <X size={20} />
            </button>

            {!bookingResult ? (
              <div className="booking-form-wrapper">
                <div className="modal-header-box">
                  <Wrench size={28} className="header-icon" />
                  <div>
                    <h3>Book Mobile & Laptop Repair</h3>
                    <p>Fill in your device details to open a digital Job Card at Nice Mobile Shop.</p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="repair-form">
                  <div className="form-row grid-2">
                    <div>
                      <label>Your Full Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="custom-input"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Mobile Number *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="10-digit mobile number"
                        className="custom-input"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row grid-2">
                    <div>
                      <label>Device Category</label>
                      <select 
                        className="custom-input"
                        value={formData.device_type}
                        onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                      >
                        <option value="Mobile">Smartphone / Mobile</option>
                        <option value="Laptop">Laptop / Computer</option>
                        <option value="Tablet">Tablet / iPad</option>
                      </select>
                    </div>
                    <div>
                      <label>Brand Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Samsung, Apple, Realme, HP"
                        className="custom-input"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Device Model Name / Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Galaxy A52, Redmi Note 12, HP Pavilion 15"
                      className="custom-input"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <label>Problem / Issue Description *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Describe what is wrong (e.g. Broken display touch not working, battery draining fast, laptop overheating...)"
                      className="custom-input"
                      value={formData.issue_description}
                      onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={bookingLoading} className="btn-primary form-submit-btn">
                    {bookingLoading ? 'Creating Job Card...' : 'Submit Repair Request ✓'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="booking-success-box">
                <CheckCircle size={56} className="success-icon" />
                <h3>Repair Job Card Created!</h3>
                <p>Please save your unique Repair Job ID below:</p>

                <div className="job-code-card">
                  <span className="job-code-val">{bookingResult.repair_code}</span>
                  <button className="copy-btn" onClick={() => copyJobCode(bookingResult.repair_code)}>
                    {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="next-steps-list">
                  <p><strong>Next Steps:</strong></p>
                  <ol>
                    <li>Bring your device to <strong>Nice Mobile Shop</strong> at Pansal Road, Bhilwara.</li>
                    <li>Show this Repair Code (<strong>{bookingResult.repair_code}</strong>) to shop owner <strong>Vijay Chandak</strong>.</li>
                    <li>Track live repair progress online anytime!</li>
                  </ol>
                </div>

                <div className="success-actions">
                  <a 
                    href={`https://wa.me/91${shopPhone.replace(/\D/g, '')}?text=Hello%20Vijay%20Ji,%20I%20have%20booked%20repair%20Job%20Code:%20${bookingResult.repair_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    <MessageSquare size={16} /> Send Job ID to Vijay Ji on WhatsApp
                  </a>

                  <button className="btn-secondary" onClick={() => setBookingResult(null)}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPAIR TRACKER MODAL */}
      {showTrackerModal && (
        <div className="modal-overlay" onClick={onCloseTrackerModal}>
          <div className="modal-container tracker-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onCloseTrackerModal}>
              <X size={20} />
            </button>

            <div className="tracker-header">
              <Search size={24} className="header-icon" />
              <div>
                <h3>Live Repair Tracker</h3>
                <p>Check real-time repair progress for your smartphone or computer.</p>
              </div>
            </div>

            {/* Tracker Input Search */}
            <form onSubmit={handleTrackSubmit} className="tracker-search-form">
              <input 
                type="text" 
                placeholder="Enter Job ID (e.g. NICE-REP-1001) or Mobile No."
                className="custom-input tracker-input"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={trackLoading}>
                {trackLoading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {/* Error state */}
            {trackError && (
              <div className="tracker-error-box">
                <AlertCircle size={20} />
                <span>{trackError}</span>
              </div>
            )}

            {/* Track Result Card */}
            {trackResult && (
              <div className="tracker-result-card glass-card">
                <div className="result-top">
                  <div>
                    <span className="result-code">{trackResult.repair_code}</span>
                    <h4 className="result-device">{trackResult.brand} {trackResult.model}</h4>
                  </div>
                  <span className="badge badge-orange status-badge">
                    {trackResult.repair_status}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="status-timeline">
                  {['Received', 'Diagnosing', 'In Repair', 'Ready', 'Delivered'].map((step, idx) => {
                    const activeIdx = getStatusStepIndex(trackResult.repair_status);
                    const isDone = (idx + 1) <= activeIdx;
                    const isCurrent = (idx + 1) === activeIdx;

                    return (
                      <div key={step} className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                        <div className="step-circle">
                          {isDone ? <Check size={12} /> : (idx + 1)}
                        </div>
                        <span className="step-label">{step}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="result-details-grid">
                  <div className="detail-box">
                    <span className="detail-label">Customer Name:</span>
                    <span className="detail-val">{trackResult.customer_name}</span>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">Issue Description:</span>
                    <span className="detail-val">{trackResult.issue_description}</span>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">Technician Notes:</span>
                    <span className="detail-val note-val">{trackResult.technician_notes || 'Diagnosing under progress at shop.'}</span>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">Estimated Repair Charge:</span>
                    <span className="detail-val cost-val">₹{trackResult.final_cost > 0 ? trackResult.final_cost : trackResult.estimated_cost}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .tracker-callout-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 30px;
          margin-bottom: 40px;
          border-color: rgba(255, 94, 54, 0.3);
          background: linear-gradient(135deg, rgba(255, 94, 54, 0.08) 0%, rgba(18, 24, 38, 0.9) 100%);
        }

        .callout-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .callout-icon {
          color: var(--accent-orange);
        }

        .callout-left h3 {
          font-size: 1.2rem;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .callout-left p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .service-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }

        .service-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .srv-icon {
          color: var(--accent-cyan);
        }

        .service-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .service-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .service-book-btn {
          margin-top: auto;
          background: none;
          color: var(--accent-cyan);
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s ease;
        }

        .service-book-btn:hover {
          gap: 10px;
        }

        /* Repair Modal Form */
        .repair-modal, .tracker-modal {
          max-width: 620px;
          padding: 30px;
        }

        .modal-header-box, .tracker-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-icon {
          color: var(--accent-cyan);
        }

        .repair-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-row label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .form-submit-btn {
          margin-top: 10px;
          padding: 12px;
          font-size: 1rem;
        }

        /* Success Box */
        .booking-success-box {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon {
          color: var(--accent-green);
          margin-bottom: 14px;
        }

        .job-code-card {
          background: rgba(0, 242, 254, 0.1);
          border: 1px dashed var(--accent-cyan);
          padding: 16px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0;
        }

        .job-code-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--accent-cyan);
          font-family: var(--font-heading);
        }

        .copy-btn {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .next-steps-list {
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          font-size: 0.9rem;
        }

        .next-steps-list ol {
          margin-left: 20px;
          margin-top: 8px;
          color: var(--text-muted);
        }

        .success-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        /* Tracker */
        .tracker-search-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tracker-error-box {
          background: rgba(255, 42, 84, 0.15);
          color: var(--accent-pink);
          padding: 12px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .tracker-result-card {
          padding: 20px;
          margin-top: 10px;
        }

        .result-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .result-code {
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 800;
        }

        .result-device {
          font-size: 1.2rem;
        }

        .status-timeline {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin: 30px 0;
        }

        .status-timeline::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--border-color);
          z-index: 1;
        }

        .timeline-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .step-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .timeline-step.done .step-circle {
          background: var(--accent-green);
          border-color: var(--accent-green);
          color: #FFF;
        }

        .timeline-step.current .step-circle {
          background: var(--accent-orange);
          border-color: var(--accent-orange);
          color: #FFF;
          box-shadow: 0 0 12px var(--accent-orange);
        }

        .step-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .timeline-step.done .step-label, .timeline-step.current .step-label {
          color: var(--text-main);
        }

        .result-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .detail-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
        }

        .detail-val {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .note-val {
          color: var(--accent-cyan);
        }

        .cost-val {
          color: var(--accent-green);
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .tracker-callout-banner {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

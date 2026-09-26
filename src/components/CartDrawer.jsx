import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  MessageSquare,
  QrCode
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  shopPhone = '094144 44908'
}) {
  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const cleanPhone = shopPhone.replace(/\D/g, '');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      const payload = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        payment_method: customer.paymentMethod,
        total_amount: subtotal,
        notes: customer.notes,
        items: cartItems
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult(data);
        setStep('success');
        onClearCart();
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (err) {
      alert('Error connecting to order backend server.');
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppOrderLink = (orderNum) => {
    const itemsListStr = cartItems.map(i => `${i.title} x${i.quantity} (₹${(i.discount_price || i.price) * i.quantity})`).join('%0A- ');
    const msg = `Hello Vijay Ji (Nice Mobile Shop), I placed an order on your website!%0A%0A📦 *Order No:* ${orderNum}%0A👤 *Customer:* ${customer.name} (${customer.phone})%0A📍 *Address:* ${customer.address}%0A💳 *Payment:* ${customer.paymentMethod}%0A💰 *Total:* ₹${subtotal}%0A%0A*Items:*%0A- ${itemsListStr}`;
    return `https://wa.me/91${cleanPhone}?text=${msg}`;
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="header-left">
            <ShoppingBag size={22} className="header-icon" />
            <h3>Your Shopping Cart ({cartItems.length})</h3>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {step === 'cart' && (
          <div className="drawer-body">
            {cartItems.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={64} className="empty-icon" />
                <h4>Your cart is empty!</h4>
                <p>Browse our store products, mobile covers, and accessories to add items to your cart.</p>
                <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items-scroll">
                  {cartItems.map(item => {
                    const price = item.discount_price || item.price;
                    return (
                      <div key={item.id} className="cart-item">
                        <img src={item.image_url} alt={item.title} className="cart-item-img" />
                        
                        <div className="cart-item-details">
                          <h4 className="cart-item-title">{item.title}</h4>
                          <span className="cart-item-price">₹{price.toLocaleString('en-IN')}</span>

                          <div className="cart-item-controls">
                            <div className="mini-qty">
                              <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                <Minus size={12} />
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                                <Plus size={12} />
                              </button>
                            </div>

                            <button 
                              className="cart-remove-btn" 
                              onClick={() => onRemoveItem(item.id)}
                              title="Remove item"
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="drawer-footer">
                  <div className="price-summary-box">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span className="subtotal-val">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-row delivery-free">
                      <span>In-Shop Pickup / Local Delivery:</span>
                      <span className="free-tag">FREE</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total Amount:</span>
                      <span className="total-val">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button className="btn-primary full-width-btn checkout-btn" onClick={() => setStep('checkout')}>
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT FORM VIEW */}
        {step === 'checkout' && (
          <div className="drawer-body">
            <div className="checkout-top">
              <button className="back-btn" onClick={() => setStep('cart')}>
                ← Back to Cart
              </button>
              <h4>Order & Delivery Details</h4>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label>Your Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  className="custom-input"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Mobile / Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="10-digit mobile number"
                  className="custom-input"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Delivery Address / Landmark (or "In-Shop Pickup") *</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Street name, colony, landmark, or write 'Shop Pickup'"
                  className="custom-input"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Select Payment Method</label>
                <div className="payment-options-grid">
                  <label className={`payment-option ${customer.paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      value="COD"
                      checked={customer.paymentMethod === 'COD'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'COD' })}
                    />
                    <CreditCard size={18} /> Cash on Delivery / Shop Payment
                  </label>

                  <label className={`payment-option ${customer.paymentMethod === 'UPI' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payMethod" 
                      value="UPI"
                      checked={customer.paymentMethod === 'UPI'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'UPI' })}
                    />
                    <QrCode size={18} /> UPI / PhonePe / Paytm Scan
                  </label>
                </div>
              </div>

              <div className="checkout-summary-mini">
                <span>Total Payable: <strong>₹{subtotal.toLocaleString('en-IN')}</strong></span>
              </div>

              <button type="submit" disabled={loading} className="btn-primary full-width-btn">
                {loading ? 'Processing Order...' : 'Confirm Order ✓'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
        {step === 'success' && orderResult && (
          <div className="drawer-body order-success-view">
            <CheckCircle size={56} className="success-icon" />
            <h3>Order Confirmed!</h3>
            <p className="order-num-text">Order No: <strong>{orderResult.order_number}</strong></p>

            <div className="order-details-summary glass-card">
              <p>Thank you for shopping at <strong>Nice Mobile Shop</strong>!</p>
              <p>Your order total is <strong>₹{subtotal.toLocaleString('en-IN')}</strong>.</p>
              <p className="small-note">Owner Vijay Chandak will prepare your items shortly.</p>
            </div>

            <div className="success-action-stack">
              <a 
                href={generateWhatsAppOrderLink(orderResult.order_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp full-width-btn"
              >
                <MessageSquare size={18} /> Send Order Copy to Vijay Ji on WhatsApp
              </a>

              <button className="btn-secondary full-width-btn" onClick={() => { setStep('cart'); onClose(); }}>
                Close Drawer
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 13, 0.8);
          backdrop-filter: blur(6px);
          z-index: 1001;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .cart-drawer {
          width: 100%;
          max-width: 440px;
          height: 100vh;
          border-radius: 0;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .drawer-header {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-icon {
          color: var(--accent-cyan);
        }

        .drawer-close-btn {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 20px;
        }

        .empty-cart-state {
          text-align: center;
          margin: auto 0;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .empty-cart-state h4 {
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .empty-cart-state p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .cart-items-scroll {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          padding: 12px;
          border-radius: var(--radius-md);
        }

        .cart-item-img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          background: #000;
          border-radius: 8px;
          padding: 4px;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cart-item-title {
          font-size: 0.9rem;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .cart-item-price {
          font-size: 1rem;
          font-weight: 800;
          color: var(--accent-cyan);
          margin-bottom: 8px;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .mini-qty {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 2px 6px;
        }

        .mini-qty button {
          background: none;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-qty span {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .cart-remove-btn {
          background: none;
          color: var(--accent-pink);
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .drawer-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          margin-top: 16px;
        }

        .price-summary-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .free-tag {
          color: var(--accent-green);
          font-weight: 800;
        }

        .total-row {
          font-size: 1.1rem;
          color: var(--text-main);
          font-weight: 800;
          border-top: 1px solid var(--border-color);
          padding-top: 8px;
        }

        .total-val {
          color: var(--accent-cyan);
          font-size: 1.25rem;
        }

        .checkout-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .back-btn {
          background: none;
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        .payment-options-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .payment-option {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .payment-option.selected {
          border-color: var(--accent-cyan);
          background: rgba(0, 242, 254, 0.1);
        }

        .checkout-summary-mini {
          background: rgba(255, 255, 255, 0.04);
          padding: 12px;
          border-radius: var(--radius-sm);
          text-align: center;
          margin: 10px 0;
          font-size: 0.95rem;
        }

        .order-success-view {
          text-align: center;
          margin: auto 0;
        }

        .order-num-text {
          font-size: 1.1rem;
          color: var(--accent-cyan);
          margin-bottom: 16px;
        }

        .order-details-summary {
          padding: 18px;
          margin-bottom: 24px;
          text-align: left;
          font-size: 0.9rem;
        }

        .small-note {
          color: var(--text-muted);
          margin-top: 8px;
          font-size: 0.82rem;
        }

        .success-action-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

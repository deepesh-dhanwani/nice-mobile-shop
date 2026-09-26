import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  UserCheck, 
  Package, 
  Wrench, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Save,
  ArrowLeft,
  Grid,
  Key,
  Eye,
  PhoneCall,
  Search,
  Filter,
  FileText
} from 'lucide-react';

export default function AdminPanel({ onBackToStore, onRefreshData, categories, products, shopInfo }) {
  const [adminToken, setAdminToken] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'repairs', 'orders', 'categories', 'settings'

  // Admin Data state
  const [stats, setStats] = useState({ totalProducts: 0, pendingRepairs: 0, pendingOrders: 0, totalRevenue: 0 });
  const [repairJobs, setRepairJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settingsForm, setSettingsForm] = useState(shopInfo || {});

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [repairSearch, setRepairSearch] = useState('');
  const [repairStatusFilter, setRepairStatusFilter] = useState('all');

  // Product Modal State (Add / Edit)
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '', category_id: 1, brand: '', price: '', discount_price: '', stock: 10, image_url: '', description: '', is_featured: false
  });

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', icon_name: 'Smartphone' });

  // Repair Edit State
  const [editingRepair, setEditingRepair] = useState(null);
  const [repairForm, setRepairForm] = useState({
    repair_status: 'Received', technician_notes: '', estimated_cost: 0, final_cost: 0
  });

  // Order Details / Edit Order State
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderForm, setEditOrderForm] = useState({
    customer_name: '', customer_phone: '', customer_address: '', total_amount: 0, payment_method: 'COD', order_status: 'Pending', notes: ''
  });

  // Change Password State
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken, activeTab]);

  useEffect(() => {
    if (shopInfo) setSettingsForm(shopInfo);
  }, [shopInfo]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, repairsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/repairs'),
        fetch('/api/orders')
      ]);

      const statsData = await statsRes.json();
      const repairsData = await repairsRes.json();
      const ordersData = await ordersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (repairsData.success) setRepairJobs(repairsData.repairs);
      if (ordersData.success) setOrders(ordersData.orders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('nice_admin_token', data.token);
        localStorage.setItem('nice_admin_user', JSON.stringify(data.admin));
      } else {
        setLoginError(data.error || 'Invalid username or password!');
      }
    } catch (err) {
      setLoginError('Error connecting to backend server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('nice_admin_token');
    localStorage.removeItem('nice_admin_user');
    sessionStorage.removeItem('nice_admin_token');
    sessionStorage.removeItem('nice_admin_user');
  };

  // Product Add / Update
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      });

      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        setEditingProduct(null);
        onRefreshData();
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        fetchAdminData();
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  // Save Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowCategoryModal(false);
        setCategoryForm({ name: '', slug: '', description: '', icon_name: 'Smartphone' });
        onRefreshData();
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (err) {
      alert('Error saving category');
    }
  };

  // Update Repair Job
  const handleUpdateRepair = async (e) => {
    e.preventDefault();
    if (!editingRepair) return;
    try {
      const res = await fetch(`/api/repairs/${editingRepair.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Repair job updated successfully!');
        setEditingRepair(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update repair job.');
      }
    } catch (err) {
      alert('Error updating repair status');
    }
  };

  // View Order Items
  const handleViewOrder = async (order) => {
    setViewingOrder(order);
    try {
      const res = await fetch(`/api/orders/${order.id}/items`);
      const data = await res.json();
      if (data.success) setOrderItems(data.items);
    } catch (err) {
      setOrderItems([]);
    }
  };

  // Save Edit Order Details
  const handleSaveOrderDetails = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      const res = await fetch(`/api/orders/${editingOrder.id}/details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editOrderForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Order details updated successfully!');
        setEditingOrder(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err) {
      alert('Error saving order details');
    }
  };

  // Update Order Status Quick
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: status })
      });
      fetchAdminData();
    } catch (err) {
      alert('Error updating order');
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew })
      });
      const data = await res.json();
      if (data.success) {
        setPwdMsg({ type: 'success', text: 'Admin password updated! Master password ilovenicemobileshop always remains valid.' });
        setPwdCurrent('');
        setPwdNew('');
      } else {
        setPwdMsg({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch (err) {
      setPwdMsg({ type: 'error', text: 'Error connecting to server.' });
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/shop/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        alert('Shop settings updated successfully!');
        onRefreshData();
      }
    } catch (err) {
      alert('Error updating shop settings');
    }
  };

  // Filtered Lists
  const filteredProducts = products.filter(p => 
    !productSearch || 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredRepairs = repairJobs.filter(r => {
    const matchesStatus = repairStatusFilter === 'all' || r.repair_status === repairStatusFilter;
    const matchesQuery = !repairSearch || 
      r.repair_code.toLowerCase().includes(repairSearch.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(repairSearch.toLowerCase()) ||
      r.customer_phone.includes(repairSearch);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="full-page-admin">
      {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
      {!adminToken ? (
        <div className="login-page-container">
          <div className="glass-card login-card">
            <button className="back-store-btn" onClick={onBackToStore}>
              <ArrowLeft size={16} /> Back to Customer Storefront
            </button>

            <div className="login-brand-header">
              <img src="/logo.png" alt="Nice Mobile Bhilwara Logo" className="login-logo-img" />
              <h2>Nice Mobile Shop Admin Portal</h2>
              <p>Management System for Vijay Chandak (Bhilwara)</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {loginError && (
                <div className="login-error-pill">
                  <AlertTriangle size={16} /> {loginError}
                </div>
              )}

              <div className="form-group">
                <label>Admin ID / Username</label>
                <input 
                  type="text" 
                  required
                  className="custom-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter admin password"
                  className="custom-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loginLoading} className="btn-primary full-width-btn login-btn">
                {loginLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* STANDALONE FULL-PAGE DASHBOARD */
        <div className="admin-page-layout">
          {/* Top Admin Header */}
          <header className="admin-header">
            <div className="header-brand">
              <button className="storefront-link-btn" onClick={onBackToStore}>
                <ArrowLeft size={16} /> Customer Storefront
              </button>
              <span className="divider">|</span>
              <img src="/logo.png" alt="Nice Mobile Bhilwara Logo" className="admin-top-logo" />
              <div className="admin-title-text">
                <h1>NICE MOBILE SHOP <span className="admin-tag">ADMIN PORTAL</span></h1>
                <span className="admin-subtitle">Bhilwara • Owner: {adminUser?.name || 'Vijay Chandak'}</span>
              </div>
            </div>

            <div className="header-actions">
              <button className="btn-secondary btn-sm" onClick={fetchAdminData}>
                <RefreshCw size={14} /> Refresh Data
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </header>

          {/* Tabbed Admin Navigation Bar */}
          <nav className="admin-nav-bar">
            <div className="nav-tabs-wrapper">
              <button 
                className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp size={16} /> Dashboard Overview
              </button>
              <button 
                className={`admin-nav-tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <Package size={16} /> Products Inventory ({products.length})
              </button>
              <button 
                className={`admin-nav-tab ${activeTab === 'repairs' ? 'active' : ''}`}
                onClick={() => setActiveTab('repairs')}
              >
                <Wrench size={16} /> Repair Jobs ({repairJobs.length})
              </button>
              <button 
                className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={16} /> Orders ({orders.length})
              </button>
              <button 
                className={`admin-nav-tab ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Grid size={16} /> Categories ({categories.length})
              </button>
              <button 
                className={`admin-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={16} /> Shop Settings & Security
              </button>
            </div>
          </nav>

          {/* MAIN PAGE CONTENT (UNRESTRICTED VERTICAL SCROLLING) */}
          <main className="admin-main-body">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="tab-pane">
                <div className="stats-row">
                  <div className="stat-card glass-card">
                    <div className="stat-icon-box cyan">
                      <Package size={26} />
                    </div>
                    <div>
                      <span className="stat-label">Total Active Products</span>
                      <h3 className="stat-val">{stats.totalProducts}</h3>
                    </div>
                  </div>

                  <div className="stat-card glass-card">
                    <div className="stat-icon-box amber">
                      <Wrench size={26} />
                    </div>
                    <div>
                      <span className="stat-label">Active Repair Jobs</span>
                      <h3 className="stat-val">{stats.pendingRepairs}</h3>
                    </div>
                  </div>

                  <div className="stat-card glass-card">
                    <div className="stat-icon-box rose">
                      <ShoppingBag size={26} />
                    </div>
                    <div>
                      <span className="stat-label">Pending Orders</span>
                      <h3 className="stat-val">{stats.pendingOrders}</h3>
                    </div>
                  </div>

                  <div className="stat-card glass-card">
                    <div className="stat-icon-box emerald">
                      <DollarSign size={26} />
                    </div>
                    <div>
                      <span className="stat-label">Total Revenue</span>
                      <h3 className="stat-val">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</h3>
                    </div>
                  </div>
                </div>

                <div className="overview-grid">
                  {/* Recent Repair Jobs */}
                  <div className="glass-card panel-card">
                    <div className="panel-card-head">
                      <h3>Recent Repair Job Cards</h3>
                      <button className="btn-secondary btn-sm" onClick={() => setActiveTab('repairs')}>View All</button>
                    </div>

                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Job Code</th>
                          <th>Device / Model</th>
                          <th>Customer</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repairJobs.slice(0, 5).map(r => (
                          <tr key={r.id}>
                            <td><strong>{r.repair_code}</strong></td>
                            <td>{r.brand} {r.model}</td>
                            <td>{r.customer_name} ({r.customer_phone})</td>
                            <td><span className="badge badge-orange">{r.repair_status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Inventory Stock Alerts */}
                  <div className="glass-card panel-card">
                    <div className="panel-card-head">
                      <h3>Product Inventory Alerts</h3>
                      <button className="btn-secondary btn-sm" onClick={() => setActiveTab('products')}>Manage Stock</button>
                    </div>

                    <div className="stock-alerts-list">
                      {products.filter(p => p.stock <= 5).map(p => (
                        <div key={p.id} className="stock-alert-item">
                          <div className="alert-item-left">
                            <AlertTriangle size={18} className="alert-icon" />
                            <div>
                              <strong>{p.title}</strong>
                              <span className="sub-text">Category: {p.category_name}</span>
                            </div>
                          </div>
                          <span className="badge badge-rose">{p.stock} left in stock</span>
                        </div>
                      ))}
                      {products.filter(p => p.stock <= 5).length === 0 && (
                        <p className="clean-stock-msg">✓ All products have adequate stock levels.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGER */}
            {activeTab === 'products' && (
              <div className="tab-pane">
                <div className="pane-header-actions">
                  <div className="search-filter-row">
                    <div className="table-search-box">
                      <Search size={16} className="s-icon" />
                      <input 
                        type="text" 
                        placeholder="Search products by title or brand..." 
                        className="custom-input"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="btn-primary" onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      title: '', category_id: 1, brand: '', price: '', discount_price: '', stock: 10, image_url: '', description: '', is_featured: false
                    });
                    setShowProductModal(true);
                  }}>
                    <Plus size={16} /> Add New Product
                  </button>
                </div>

                <div className="glass-card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Discount Price</th>
                        <th>Stock Level</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="prod-cell">
                              <img src={p.image_url} alt={p.title} className="t-img" />
                              <div>
                                <strong>{p.title}</strong>
                                <span className="sub-text">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td>{p.category_name || 'General'}</td>
                          <td>₹{p.price.toLocaleString('en-IN')}</td>
                          <td>{p.discount_price ? `₹${p.discount_price.toLocaleString('en-IN')}` : '-'}</td>
                          <td>
                            <span className={`badge ${p.stock > 5 ? 'badge-green' : 'badge-rose'}`}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td>{p.is_featured ? '⭐ Yes' : 'No'}</td>
                          <td>
                            <div className="t-actions">
                              <button className="action-icon-btn edit" onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  title: p.title,
                                  category_id: p.category_id,
                                  brand: p.brand,
                                  price: p.price,
                                  discount_price: p.discount_price || '',
                                  stock: p.stock,
                                  image_url: p.image_url,
                                  description: p.description,
                                  is_featured: p.is_featured === 1
                                });
                                setShowProductModal(true);
                              }} title="Edit">
                                <Edit3 size={15} />
                              </button>
                              <button className="action-icon-btn delete" onClick={() => handleDeleteProduct(p.id)} title="Delete">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: REPAIR JOBS */}
            {activeTab === 'repairs' && (
              <div className="tab-pane">
                <div className="pane-header-actions">
                  <div className="search-filter-row">
                    <div className="table-search-box">
                      <Search size={16} className="s-icon" />
                      <input 
                        type="text" 
                        placeholder="Search Job ID or Customer Phone..." 
                        className="custom-input"
                        value={repairSearch}
                        onChange={(e) => setRepairSearch(e.target.value)}
                      />
                    </div>

                    <div className="status-filter-pills">
                      {['all', 'Received', 'Diagnosing', 'In Repair', 'Ready', 'Delivered'].map(status => (
                        <button 
                          key={status}
                          className={`filter-pill ${repairStatusFilter === status ? 'active' : ''}`}
                          onClick={() => setRepairStatusFilter(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Job ID</th>
                        <th>Customer</th>
                        <th>Device & Model</th>
                        <th>Issue Description</th>
                        <th>Technician Notes</th>
                        <th>Status</th>
                        <th>Final Cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRepairs.map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.repair_code}</strong></td>
                          <td>
                            {r.customer_name}
                            <span className="sub-text">📞 {r.customer_phone}</span>
                          </td>
                          <td>
                            {r.brand} {r.model}
                            <span className="sub-text">{r.device_type}</span>
                          </td>
                          <td><span className="desc-cell">{r.issue_description}</span></td>
                          <td><span className="note-cell">{r.technician_notes || 'Pending diagnosis'}</span></td>
                          <td><span className="badge badge-orange">{r.repair_status}</span></td>
                          <td><strong>₹{r.final_cost > 0 ? r.final_cost : r.estimated_cost}</strong></td>
                          <td>
                            <button className="btn-primary btn-sm update-job-btn" onClick={() => {
                              setEditingRepair(r);
                              setRepairForm({
                                repair_status: r.repair_status,
                                technician_notes: r.technician_notes || '',
                                estimated_cost: r.estimated_cost || 0,
                                final_cost: r.final_cost || 0
                              });
                            }}>
                              Update Job
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: ORDERS */}
            {activeTab === 'orders' && (
              <div className="tab-pane">
                <div className="glass-card table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order No</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Total Payable</th>
                        <th>Payment</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.order_number}</strong></td>
                          <td>
                            {o.customer_name}
                            <span className="sub-text">📞 {o.customer_phone}</span>
                          </td>
                          <td><span className="desc-cell">{o.customer_address}</span></td>
                          <td><strong className="green-text">₹{o.total_amount.toLocaleString('en-IN')}</strong></td>
                          <td><span className="badge badge-cyan">{o.payment_method}</span></td>
                          <td>
                            <select 
                              className="status-select-input"
                              value={o.order_status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div className="t-actions">
                              <button className="btn-primary btn-sm" onClick={() => {
                                setEditingOrder(o);
                                setEditOrderForm({
                                  customer_name: o.customer_name,
                                  customer_phone: o.customer_phone,
                                  customer_address: o.customer_address,
                                  total_amount: o.total_amount,
                                  payment_method: o.payment_method,
                                  order_status: o.order_status,
                                  notes: o.notes || ''
                                });
                              }}>
                                <Edit3 size={14} /> Edit Order
                              </button>

                              <button className="btn-secondary btn-sm" onClick={() => handleViewOrder(o)}>
                                <Eye size={14} /> View Items
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="tab-pane">
                <div className="pane-header-actions">
                  <h3>Product Categories</h3>
                  <button className="btn-primary" onClick={() => setShowCategoryModal(true)}>
                    <Plus size={16} /> Add New Category
                  </button>
                </div>

                <div className="categories-grid">
                  {categories.map(cat => (
                    <div key={cat.id} className="glass-card category-item-card">
                      <div className="cat-head">
                        <Grid className="cat-icon" />
                        <span className="badge badge-cyan">{cat.slug}</span>
                      </div>
                      <h4>{cat.name}</h4>
                      <p>{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SHOP SETTINGS & SECURITY */}
            {activeTab === 'settings' && (
              <div className="tab-pane">
                <div className="settings-grid-layout">
                  {/* Left: Store Settings */}
                  <div className="glass-card settings-card">
                    <h3>Store Contact & Marquee Announcement</h3>
                    <form onSubmit={handleSaveSettings} className="settings-form">
                      <div className="form-group">
                        <label>Shop Name</label>
                        <input 
                          type="text" className="custom-input"
                          value={settingsForm.shop_name || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shop_name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Owner Name</label>
                        <input 
                          type="text" className="custom-input"
                          value={settingsForm.owner_name || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, owner_name: e.target.value })}
                        />
                      </div>

                      <div className="grid-2">
                        <div className="form-group">
                          <label>Primary Phone Number</label>
                          <input 
                            type="text" className="custom-input"
                            value={settingsForm.phone_primary || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Secondary Phone Number</label>
                          <input 
                            type="text" className="custom-input"
                            value={settingsForm.phone_secondary || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone_secondary: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Full Shop Address</label>
                        <textarea 
                          rows={2} className="custom-input"
                          value={settingsForm.address || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Top Marquee Announcement Banner</label>
                        <input 
                          type="text" className="custom-input"
                          value={settingsForm.banner_announcement || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, banner_announcement: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="btn-primary">
                        <Save size={16} /> Save Shop Info
                      </button>
                    </form>
                  </div>

                  {/* Right: Security & Admin Password */}
                  <div className="glass-card settings-card">
                    <h3><Key size={18} /> Change Admin Password</h3>
                    <form onSubmit={handleChangePassword} className="settings-form">
                      {pwdMsg.text && (
                        <div className={`pwd-msg-pill ${pwdMsg.type}`}>
                          {pwdMsg.text}
                        </div>
                      )}

                      <div className="form-group">
                        <label>Current Admin Password *</label>
                        <input 
                          type="password" required className="custom-input"
                          value={pwdCurrent}
                          onChange={(e) => setPwdCurrent(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>New Password *</label>
                        <input 
                          type="password" required className="custom-input"
                          placeholder="At least 6 characters"
                          value={pwdNew}
                          onChange={(e) => setPwdNew(e.target.value)}
                        />
                      </div>

                      <p className="master-pwd-hint">ℹ Note: Default master password <strong>ilovenicemobileshop</strong> is always active for owner backup access.</p>

                      <button type="submit" className="btn-primary">
                        <Lock size={16} /> Update Admin Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="pop-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="pop-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>
              <X size={20} />
            </button>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

            <form onSubmit={handleSaveProduct} className="sub-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input 
                  type="text" required className="custom-input"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="custom-input"
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand Name</label>
                  <input 
                    type="text" className="custom-input"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Original Price (₹) *</label>
                  <input 
                    type="number" required className="custom-input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Discount Price (₹)</label>
                  <input 
                    type="number" className="custom-input"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" className="custom-input"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input 
                    type="text" className="custom-input"
                    placeholder="https://..."
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows={2} className="custom-input"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                  /> Mark as Featured Item on Banner
                </label>
              </div>

              <button type="submit" className="btn-primary full-width-btn">Save Product ✓</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CATEGORY */}
      {showCategoryModal && (
        <div className="pop-modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="pop-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCategoryModal(false)}>
              <X size={20} />
            </button>
            <h3>Add New Product Category</h3>

            <form onSubmit={handleSaveCategory} className="sub-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input 
                  type="text" required placeholder="e.g. Smartwatches & Bands" className="custom-input"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                />
              </div>

              <div className="form-group">
                <label>Category Slug (URL Identifier) *</label>
                <input 
                  type="text" required className="custom-input"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows={2} className="custom-input"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full-width-btn">Create Category ✓</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT REPAIR JOB CARD */}
      {editingRepair && (
        <div className="pop-modal-overlay" onClick={() => setEditingRepair(null)}>
          <div className="pop-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditingRepair(null)}>
              <X size={20} />
            </button>
            <h3>Update Job Card: {editingRepair.repair_code}</h3>
            <p className="sub-text">Customer: <strong>{editingRepair.customer_name}</strong> ({editingRepair.brand} {editingRepair.model})</p>

            <form onSubmit={handleUpdateRepair} className="sub-form">
              <div className="form-group">
                <label>Repair Progress Status *</label>
                <select 
                  className="custom-input"
                  value={repairForm.repair_status}
                  onChange={(e) => setRepairForm({ ...repairForm, repair_status: e.target.value })}
                >
                  <option value="Received">Received</option>
                  <option value="Diagnosing">Diagnosing</option>
                  <option value="In Repair">In Repair</option>
                  <option value="Ready">Ready for Pickup</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Technician Notes</label>
                <textarea 
                  rows={3} className="custom-input"
                  placeholder="e.g. Screen replaced with original AMOLED unit. Verified touch and camera."
                  value={repairForm.technician_notes}
                  onChange={(e) => setRepairForm({ ...repairForm, technician_notes: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Estimated Charge (₹)</label>
                  <input 
                    type="number" className="custom-input"
                    value={repairForm.estimated_cost}
                    onChange={(e) => setRepairForm({ ...repairForm, estimated_cost: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Final Billing Cost (₹)</label>
                  <input 
                    type="number" className="custom-input"
                    value={repairForm.final_cost}
                    onChange={(e) => setRepairForm({ ...repairForm, final_cost: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary full-width-btn">Save Repair Job Status ✓</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT ORDER DETAILS */}
      {editingOrder && (
        <div className="pop-modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="pop-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditingOrder(null)}>
              <X size={20} />
            </button>
            <h3>Edit Order: {editingOrder.order_number}</h3>

            <form onSubmit={handleSaveOrderDetails} className="sub-form">
              <div className="grid-2">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input 
                    type="text" required className="custom-input"
                    value={editOrderForm.customer_name}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, customer_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input 
                    type="tel" required className="custom-input"
                    value={editOrderForm.customer_phone}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, customer_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea 
                  rows={2} required className="custom-input"
                  value={editOrderForm.customer_address}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, customer_address: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Total Amount Payable (₹) *</label>
                  <input 
                    type="number" required className="custom-input"
                    value={editOrderForm.total_amount}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, total_amount: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select 
                    className="custom-input"
                    value={editOrderForm.payment_method}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, payment_method: e.target.value })}
                  >
                    <option value="COD">Cash on Delivery / Shop</option>
                    <option value="UPI">UPI / Scan</option>
                    <option value="WhatsApp">WhatsApp Direct</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Order Status</label>
                <select 
                  className="custom-input"
                  value={editOrderForm.order_status}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, order_status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Order Notes</label>
                <input 
                  type="text" className="custom-input"
                  placeholder="e.g. Special packing requested"
                  value={editOrderForm.notes}
                  onChange={(e) => setEditOrderForm({ ...editOrderForm, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full-width-btn">Save Order Changes ✓</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: VIEW ORDER ITEMS */}
      {viewingOrder && (
        <div className="pop-modal-overlay" onClick={() => setViewingOrder(null)}>
          <div className="pop-modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewingOrder(null)}>
              <X size={20} />
            </button>
            <h3>Order Details: {viewingOrder.order_number}</h3>

            <div className="order-view-details">
              <p><strong>Customer:</strong> {viewingOrder.customer_name} (📞 {viewingOrder.customer_phone})</p>
              <p><strong>Address:</strong> {viewingOrder.customer_address}</p>
              <p><strong>Payment Method:</strong> {viewingOrder.payment_method}</p>
              <p><strong>Total Amount:</strong> ₹{viewingOrder.total_amount.toLocaleString('en-IN')}</p>
              
              <h4 className="items-head">Ordered Items:</h4>
              <div className="order-items-table">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="item-line-row">
                    <span>{item.product_name} x {item.quantity}</span>
                    <strong>₹{item.total_price.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .full-page-admin {
          min-height: 100vh;
          width: 100vw;
          background: #090D16;
          color: #F8FAFC;
          overflow-x: hidden;
        }

        .login-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 36px;
          position: relative;
        }

        .back-store-btn {
          background: none;
          color: var(--accent-cyan);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
        }

        .login-brand-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .login-logo-img {
          height: 60px;
          object-fit: contain;
          border-radius: 8px;
          background: #FFF;
          padding: 4px 10px;
          margin: 0 auto 16px;
        }

        .login-brand-header h2 {
          font-size: 1.35rem;
          margin-bottom: 4px;
        }

        .login-brand-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-error-pill {
          background: rgba(251, 113, 133, 0.15);
          color: var(--accent-rose);
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Layout */
        .admin-page-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .admin-header {
          background: #0D1424;
          border-bottom: 1px solid var(--border-color);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .storefront-link-btn {
          background: rgba(255, 255, 255, 0.08);
          color: var(--accent-cyan);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .divider {
          color: var(--text-muted);
        }

        .admin-top-logo {
          height: 40px;
          background: #FFF;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .admin-title-text h1 {
          font-size: 1.15rem;
          color: #FFF;
        }

        .admin-tag {
          color: var(--accent-cyan);
          font-size: 0.8rem;
        }

        .admin-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logout-btn {
          background: rgba(251, 113, 133, 0.15);
          color: var(--accent-rose);
          border: 1px solid rgba(251, 113, 133, 0.3);
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Navigation Bar */
        .admin-nav-bar {
          background: #111827;
          border-bottom: 1px solid var(--border-color);
          padding: 8px 28px;
          position: sticky;
          top: 69px;
          z-index: 99;
        }

        .nav-tabs-wrapper {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .admin-nav-tab {
          background: none;
          color: var(--text-muted);
          padding: 10px 18px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .admin-nav-tab.active {
          background: var(--grad-primary);
          color: #FFF;
        }

        /* Main Pane */
        .admin-main-body {
          flex: 1;
          padding: 28px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon-box.cyan { background: rgba(56, 189, 248, 0.15); color: var(--accent-cyan); }
        .stat-icon-box.amber { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); }
        .stat-icon-box.rose { background: rgba(251, 113, 133, 0.15); color: var(--accent-rose); }
        .stat-icon-box.emerald { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); }

        .stat-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        .stat-val {
          font-size: 1.6rem;
          font-weight: 800;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
        }

        .panel-card {
          padding: 24px;
        }

        .panel-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stock-alerts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stock-alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .alert-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alert-icon {
          color: var(--accent-rose);
        }

        .clean-stock-msg {
          color: var(--accent-emerald);
          font-size: 0.9rem;
          padding: 10px 0;
        }

        /* Table Card */
        .table-card {
          padding: 10px;
          overflow-x: auto;
        }

        .pane-header-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .table-search-box {
          position: relative;
          min-width: 280px;
        }

        .s-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .table-search-box .custom-input {
          padding-left: 36px;
        }

        .status-filter-pills {
          display: flex;
          gap: 6px;
        }

        .filter-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .filter-pill.active {
          background: var(--accent-cyan);
          color: #090D16;
          font-weight: 800;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .admin-table th, .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          text-align: left;
        }

        .admin-table th {
          color: var(--text-muted);
          font-size: 0.78rem;
          text-transform: uppercase;
        }

        .prod-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .t-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          background: #000;
          border-radius: 8px;
        }

        .t-actions {
          display: flex;
          gap: 6px;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .action-icon-btn.edit { color: var(--accent-cyan); }
        .action-icon-btn.delete { color: var(--accent-rose); }

        .update-job-btn {
          background: var(--grad-primary);
          color: #FFF;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
        }

        .desc-cell {
          max-width: 220px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .note-cell {
          color: var(--accent-cyan);
          font-size: 0.82rem;
        }

        .green-text {
          color: var(--accent-emerald);
        }

        .status-select-input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.82rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .category-item-card {
          padding: 20px;
        }

        .cat-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .cat-icon {
          color: var(--accent-cyan);
        }

        .settings-grid-layout {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }

        .settings-card {
          padding: 28px;
        }

        .settings-card h3 {
          font-size: 1.2rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .master-pwd-hint {
          font-size: 0.82rem;
          color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.1);
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 4px;
        }

        .pwd-msg-pill {
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .pwd-msg-pill.success { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); }
        .pwd-msg-pill.error { background: rgba(251, 113, 133, 0.15); color: var(--accent-rose); }

        /* Standalone Popup Modals Overlay */
        .pop-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 10, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        .pop-modal-container {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 30px;
          position: relative;
          background: #131B2E;
          border: 1px solid rgba(56, 189, 248, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        .sub-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }

        .order-view-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
          font-size: 0.92rem;
        }

        .items-head {
          margin-top: 10px;
          border-top: 1px solid var(--border-color);
          padding-top: 10px;
        }

        .order-items-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-line-row {
          display: flex;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.88rem;
        }

        @media (max-width: 992px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .overview-grid, .settings-grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

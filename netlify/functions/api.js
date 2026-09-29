import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'nice_mobile_shop_secret_key_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const defaultCategories = [
  { id: 1, name: 'Smartphones & Feature Phones', slug: 'smartphones', description: 'Brand new & refurbished mobile phones', icon_name: 'Smartphone' },
  { id: 2, name: 'Covers & Cases', slug: 'covers-cases', description: 'Trendy back covers, flip covers & protective cases', icon_name: 'Shield' },
  { id: 3, name: 'Chargers & Cables', slug: 'chargers-cables', description: 'Fast chargers, Type-C cables, power banks', icon_name: 'Zap' },
  { id: 4, name: 'Audio & Earphones', slug: 'audio-wireless', description: 'Bluetooth neckbands, TWS earbuds, wired earphones', icon_name: 'Headphones' },
  { id: 5, name: 'Screen Guards & Glass', slug: 'screen-guards', description: '11D tempered glass, matte guards, privacy glass', icon_name: 'Smartphone' },
  { id: 6, name: 'Laptop & Computer Repair Parts', slug: 'laptop-accessories', description: 'Keyboards, RAM, SSDs, adapters & repair spares', icon_name: 'Monitor' }
];

const defaultProducts = [
  {
    id: 1,
    title: 'Redmi Note 13 Pro 5G (8GB / 256GB - Midnight Black)',
    category_id: 1,
    brand: 'Xiaomi',
    price: 21999.00,
    discount_price: 19999.00,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful 200MP camera, 120Hz AMOLED display, 67W Turbo Charge.',
    specs: { "Display": "6.67 inch AMOLED 120Hz", "Processor": "Snapdragon 7s Gen 2", "Camera": "200MP + 8MP + 2MP", "Battery": "5100mAh" },
    is_featured: 1,
    is_active: 1
  },
  {
    id: 2,
    title: 'Samsung Galaxy M34 5G (6GB / 128GB - Prism Blue)',
    category_id: 1,
    brand: 'Samsung',
    price: 18999.00,
    discount_price: 15999.00,
    stock: 5,
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    description: 'Monster 6000mAh battery, 50MP OIS camera, Super AMOLED 120Hz display.',
    specs: { "Display": "6.5 inch FHD+ Super AMOLED", "Battery": "6000mAh", "Camera": "50MP OIS", "RAM": "6GB" },
    is_featured: 1,
    is_active: 1
  },
  {
    id: 3,
    title: 'boAt Airdopes 141 Bluetooth TWS Earbuds',
    category_id: 4,
    brand: 'boAt',
    price: 2990.00,
    discount_price: 1299.00,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    description: '42H playtime, ENx Tech, low latency Beast Mode, IPX4 water resistance.',
    specs: { "Playtime": "42 Hours", "Driver": "8mm Dynamic", "Latency": "80ms", "Charging": "ASAP Fast Charge" },
    is_featured: 1,
    is_active: 1
  },
  {
    id: 4,
    title: '65W Super Fast Charging Adapter + Type-C Cable',
    category_id: 3,
    brand: 'Realme',
    price: 1999.00,
    discount_price: 1199.00,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'Original high-speed GaN fast charger with multi-layer safety protection.',
    specs: { "Power": "65W Max", "Port": "Type-C", "Cable Length": "1.2 Meter", "Compatibility": "All Smartphones" },
    is_featured: 1,
    is_active: 1
  }
];

const defaultSettings = {
  shop_name: 'Nice Mobile Bhilwara',
  owner_name: 'Vijay Chandak',
  phone_primary: '88905 21023',
  phone_secondary: '094144 44908',
  address: 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara, Rajasthan 311001',
  maps_url: 'https://maps.google.com/maps?q=Nice+Mobile+Bhilwara+Pansal+Road+Bhilwara',
  timing: '9:00 AM - 9:00 PM (Monday to Saturday)',
  banner_announcement: '🔥 Special Offer: Free Tempered Glass & Cover with Every Mobile Repair! Visit Nice Mobile Bhilwara today.',
  logo_url: '/logo.png'
};

// Pure JavaScript in-memory & file store (No native C++ modules, 100% reliable on Netlify)
const TMP_DATA_FILE = path.join('/tmp', 'nice_shop_data.json');

function loadStore() {
  try {
    if (fs.existsSync(TMP_DATA_FILE)) {
      const raw = fs.readFileSync(TMP_DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch {}
  return {
    categories: [...defaultCategories],
    products: [...defaultProducts],
    settings: { ...defaultSettings },
    repairs: [],
    orders: [],
    order_items: [],
    admin_password: 'ilovenicemobileshop'
  };
}

let memoryStore = loadStore();

function saveStore() {
  try {
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch {}
}

const router = express.Router();

// 1. Shop Info
router.get('/shop/info', (req, res) => {
  res.json({ success: true, settings: memoryStore.settings, dbType: 'serverless-json' });
});

router.put('/shop/settings', (req, res) => {
  memoryStore.settings = { ...memoryStore.settings, ...req.body };
  saveStore();
  res.json({ success: true, message: 'Settings and logo updated successfully', settings: memoryStore.settings });
});

// 2. Categories
router.get('/categories', (req, res) => {
  res.json({ success: true, categories: memoryStore.categories });
});

router.post('/categories', (req, res) => {
  const { name, slug, description, icon_name } = req.body;
  const newCat = {
    id: Date.now(),
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description: description || '',
    icon_name: icon_name || 'Smartphone'
  };
  memoryStore.categories.push(newCat);
  saveStore();
  res.json({ success: true, categoryId: newCat.id });
});

// 3. Products
router.get('/products', (req, res) => {
  const { category, search, featured, brand } = req.query;
  let list = memoryStore.products.filter(p => p.is_active !== 0);

  if (category) {
    list = list.filter(p => String(p.category_id) === String(category) || p.category_slug === category);
  }
  if (brand) {
    list = list.filter(p => p.brand?.toLowerCase().includes(brand.toLowerCase()));
  }
  if (featured === '1' || featured === 'true') {
    list = list.filter(p => p.is_featured);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => 
      p.title?.toLowerCase().includes(s) || 
      p.brand?.toLowerCase().includes(s) || 
      p.description?.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, products: list });
});

router.post('/products', (req, res) => {
  const { title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured } = req.body;
  const newProd = {
    id: Date.now(),
    title,
    category_id: Number(category_id) || 1,
    brand: brand || 'Generic',
    price: Number(price) || 0,
    discount_price: discount_price ? Number(discount_price) : null,
    stock: stock !== undefined ? Number(stock) : 10,
    image_url: image_url || '/logo.png',
    description: description || '',
    specs: typeof specs === 'object' ? specs : {},
    is_featured: is_featured ? 1 : 0,
    is_active: 1
  };
  memoryStore.products.unshift(newProd);
  saveStore();
  res.json({ success: true, productId: newProd.id });
});

router.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = memoryStore.products.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...req.body };
    saveStore();
    return res.json({ success: true, message: 'Updated' });
  }
  res.status(404).json({ success: false, message: 'Product not found' });
});

router.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = memoryStore.products.findIndex(p => p.id === id);
  if (idx !== -1) {
    memoryStore.products[idx].is_active = 0;
    saveStore();
  }
  res.json({ success: true });
});

// 4. Repairs
router.get('/repairs/track/:query', (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const matched = memoryStore.repairs.filter(r => 
    r.repair_code.toLowerCase().includes(q) || 
    r.customer_phone.includes(q)
  );
  if (matched.length === 0) {
    return res.status(404).json({ success: false, message: 'No repair job found' });
  }
  res.json({ success: true, repairs: matched });
});

router.post('/repairs', (req, res) => {
  const { customer_name, customer_phone, device_type, brand, model, issue_description } = req.body;
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const repair_code = `NICE-REP-${randomNum}`;
  const newRepair = {
    id: Date.now(),
    repair_code,
    customer_name,
    customer_phone,
    device_type: device_type || 'Mobile',
    brand: brand || 'Generic',
    model: model || '',
    issue_description: issue_description || '',
    repair_status: 'Received',
    technician_notes: 'Repair request received at Nice Mobile Bhilwara.',
    estimated_cost: 0,
    final_cost: 0,
    created_at: new Date().toISOString()
  };
  memoryStore.repairs.unshift(newRepair);
  saveStore();
  res.json({ success: true, repair_code });
});

router.get('/repairs', (req, res) => {
  res.json({ success: true, repairs: memoryStore.repairs });
});

router.put('/repairs/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = memoryStore.repairs.findIndex(r => r.id === id);
  if (idx !== -1) {
    memoryStore.repairs[idx] = { ...memoryStore.repairs[idx], ...req.body };
    saveStore();
  }
  res.json({ success: true });
});

// 5. Orders
router.post('/orders', (req, res) => {
  const { customer_name, customer_phone, customer_address, payment_method, items, total_amount, notes } = req.body;
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const order_number = `NICE-ORD-${randomNum}`;
  const orderId = Date.now();

  const newOrder = {
    id: orderId,
    order_number,
    customer_name,
    customer_phone,
    customer_address,
    total_amount: Number(total_amount) || 0,
    payment_method: payment_method || 'COD',
    order_status: 'Pending',
    notes: notes || '',
    created_at: new Date().toISOString()
  };

  memoryStore.orders.unshift(newOrder);

  if (Array.isArray(items)) {
    items.forEach(item => {
      memoryStore.order_items.push({
        id: Date.now() + Math.random(),
        order_id: orderId,
        product_id: item.id,
        product_name: item.title,
        price: item.discount_price || item.price,
        quantity: item.quantity || 1,
        total_price: (item.discount_price || item.price) * (item.quantity || 1)
      });
    });
  }

  saveStore();
  res.json({ success: true, order_number, orderId });
});

router.get('/orders', (req, res) => {
  res.json({ success: true, orders: memoryStore.orders });
});

router.put('/orders/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = memoryStore.orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    memoryStore.orders[idx].order_status = req.body.order_status;
    saveStore();
  }
  res.json({ success: true });
});

router.put('/orders/:id/details', (req, res) => {
  const id = Number(req.params.id);
  const idx = memoryStore.orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    memoryStore.orders[idx] = { ...memoryStore.orders[idx], ...req.body };
    saveStore();
  }
  res.json({ success: true });
});

router.get('/orders/:id/items', (req, res) => {
  const id = Number(req.params.id);
  const items = memoryStore.order_items.filter(i => i.order_id === id);
  res.json({ success: true, items });
});

// 6. Admin Authentication & Stats
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const isMatch = (password === 'ilovenicemobileshop' || password === memoryStore.admin_password);

  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid Username or Password!' });
  }

  const token = 'nice_token_' + Date.now();
  res.json({
    success: true,
    token,
    admin: { id: 1, username: 'admin', name: 'Vijay Chandak', role: 'admin' }
  });
});

router.put('/admin/password', (req, res) => {
  const { newPassword } = req.body;
  if (newPassword) {
    memoryStore.admin_password = newPassword;
    saveStore();
  }
  res.json({ success: true, message: 'Password updated. Master password ilovenicemobileshop always active.' });
});

router.get('/admin/stats', (req, res) => {
  const totalProducts = memoryStore.products.filter(p => p.is_active !== 0).length;
  const pendingRepairs = memoryStore.repairs.filter(r => ['Received', 'Diagnosing', 'In Repair'].includes(r.repair_status)).length;
  const pendingOrders = memoryStore.orders.filter(o => o.order_status === 'Pending').length;
  const totalRevenue = memoryStore.orders
    .filter(o => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  res.json({
    success: true,
    stats: {
      totalProducts,
      pendingRepairs,
      pendingOrders,
      totalRevenue
    }
  });
});

app.use('/.netlify/functions/api', router);
app.use('/api', router);

export const handler = serverless(app);

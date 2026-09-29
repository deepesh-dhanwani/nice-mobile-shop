import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nice_mobile_shop_secret_key_2026';

app.use(cors());
app.use(express.json());

// Database Driver Wrapper to support both MySQL and SQLite seamlessly
let dbDriver = null;
let dbType = 'unknown';

// Initial default in-memory / SQLite seed data if database is fresh
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
    description: 'Powerful 200MP camera, 120Hz AMOLED display, 67W Turbo Charge. Available at Nice Mobile Shop Bhilwara.',
    specs: JSON.stringify({ "Display": "6.67 inch AMOLED 120Hz", "Processor": "Snapdragon 7s Gen 2", "Camera": "200MP + 8MP + 2MP", "Battery": "5100mAh" }),
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
    specs: JSON.stringify({ "Display": "6.5 inch FHD+ Super AMOLED", "Battery": "6000mAh", "Camera": "50MP OIS", "RAM": "6GB" }),
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
    specs: JSON.stringify({ "Playtime": "42 Hours", "Driver": "8mm Dynamic", "Latency": "80ms", "Charging": "ASAP Fast Charge" }),
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
    specs: JSON.stringify({ "Power": "65W Max", "Port": "Type-C", "Cable Length": "1.2 Meter", "Compatibility": "All Smartphones" }),
    is_featured: 1,
    is_active: 1
  },
  {
    id: 5,
    title: 'Premium Leather Armor Back Cover (Multi Models)',
    category_id: 2,
    brand: 'Nice Select',
    price: 599.00,
    discount_price: 299.00,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    description: 'Shockproof slim leather back case available for all iPhone, Samsung, Realme, Vivo, Xiaomi models.',
    specs: JSON.stringify({ "Material": "PU Leather + TPU", "Features": "Camera Bump Protection, Non-Slip" }),
    is_featured: 0,
    is_active: 1
  },
  {
    id: 6,
    title: '11D Curved Tempered Glass (Unbreakable Shield)',
    category_id: 5,
    brand: 'Nice Select',
    price: 399.00,
    discount_price: 199.00,
    stock: 100,
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    description: 'Full edge-to-edge curved tempered glass installation included at shop.',
    specs: JSON.stringify({ "Hardness": "9H Tempered", "Clarity": "99.9% HD", "Installation": "Free Shop Fitting" }),
    is_featured: 0,
    is_active: 1
  },
  {
    id: 7,
    title: 'Crucial 500GB NVMe M.2 SSD Laptop Upgrade Kit',
    category_id: 6,
    brand: 'Crucial',
    price: 4500.00,
    discount_price: 3499.00,
    stock: 10,
    image_url: 'https://images.unsplash.com/photo-1597872250970-45640840498b?auto=format&fit=crop&w=800&q=80',
    description: 'Speed up your slow laptop by 10x! Includes free OS installation and data backup service at Nice Mobile Shop.',
    specs: JSON.stringify({ "Capacity": "500GB", "Speed": "up to 3500 MB/s", "Form Factor": "M.2 NVMe", "Warranty": "3 Years" }),
    is_featured: 1,
    is_active: 1
  }
];

const defaultRepairs = [
  {
    id: 1,
    repair_code: 'NICE-REP-1001',
    customer_name: 'Rahul Sharma',
    customer_phone: '9829012345',
    device_type: 'Mobile',
    brand: 'Samsung',
    model: 'Galaxy A52',
    issue_description: 'Display screen cracked and touch non-responsive.',
    repair_status: 'In Repair',
    technician_notes: 'Original AMOLED screen display replacement in progress.',
    estimated_cost: 3200.00,
    final_cost: 3200.00,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    repair_code: 'NICE-REP-1002',
    customer_name: 'Pooja Verma',
    customer_phone: '9414098765',
    device_type: 'Mobile',
    brand: 'Realme',
    model: '7 Pro',
    issue_description: 'Battery draining fast & charging port loose.',
    repair_status: 'Ready',
    technician_notes: 'Battery replaced with original 4500mAh unit & new Type-C sub-board fixed. Ready for pickup!',
    estimated_cost: 1450.00,
    final_cost: 1450.00,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    repair_code: 'NICE-REP-1003',
    customer_name: 'Deepak Jain',
    customer_phone: '9983112233',
    device_type: 'Laptop',
    brand: 'HP',
    model: 'Pavilion 15',
    issue_description: 'Laptop overheating and running slow, display flickering.',
    repair_status: 'Diagnosing',
    technician_notes: 'Cleaning cooling fan, applying liquid thermal paste and checking display ribbon cable.',
    estimated_cost: 850.00,
    final_cost: 0.00,
    created_at: new Date().toISOString()
  }
];

const defaultSettings = {
  shop_name: 'Nice Mobile Bhilwara',
  owner_name: 'Vijay Chandak',
  phone_primary: '88905 21023',
  phone_secondary: '094144 44908',
  address: 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara, Rajasthan 311001',
  maps_url: 'https://maps.google.com/maps?q=Nice+Mobile+Shop+Pansal+Road+Bhilwara',
  timing: '9:00 AM - 9:00 PM (Monday to Saturday)',
  banner_announcement: '🔥 Special Offer: Free Tempered Glass & Cover with Every Mobile Repair! Visit Nice Mobile Shop Bhilwara today.'
};

async function initDatabase() {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'nice_mobile_shop';

  try {
    console.log(`[Database] Attempting MySQL connection to ${dbHost}:${dbName}...`);
    const pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log(`[Database] Connected successfully to MySQL! Database: ${dbName}`);
    connection.release();

    dbType = 'mysql';
    dbDriver = {
      async query(sql, params = []) {
        const [rows] = await pool.execute(sql, params);
        return rows;
      }
    };
  } catch (mysqlErr) {
    console.warn(`[Database] MySQL Connection skipped/unavailable: ${mysqlErr.message}`);
    console.log(`[Database] Falling back to embedded SQLite database engine for instant execution.`);

    const sqliteDb = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Create Tables in SQLite
    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon_name TEXT DEFAULT 'Smartphone',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        brand TEXT DEFAULT 'Generic',
        price REAL NOT NULL,
        discount_price REAL DEFAULT NULL,
        stock INTEGER DEFAULT 10,
        image_url TEXT,
        description TEXT,
        specs TEXT DEFAULT NULL,
        is_featured INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS repairs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repair_code TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        device_type TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        issue_description TEXT NOT NULL,
        repair_status TEXT DEFAULT 'Received',
        technician_notes TEXT,
        estimated_cost REAL DEFAULT 0.0,
        final_cost REAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        total_amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'COD',
        order_status TEXT DEFAULT 'Pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        total_price REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS shop_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin if missing
    const adminExists = await sqliteDb.get(`SELECT id FROM admin_users WHERE username = ?`, ['admin']);
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('ilovenicemobileshop', 10);
      await sqliteDb.run(
        `INSERT INTO admin_users (username, password_hash, name, role) VALUES (?, ?, ?, ?)`,
        ['admin', passwordHash, 'Vijay Chandak', 'admin']
      );
    } else {
      // Ensure password hash is updated to ilovenicemobileshop
      const passwordHash = await bcrypt.hash('ilovenicemobileshop', 10);
      await sqliteDb.run(`UPDATE admin_users SET password_hash = ? WHERE username = ?`, [passwordHash, 'admin']);
    }

    // Seed Categories if empty
    const catCount = await sqliteDb.get(`SELECT COUNT(*) as cnt FROM categories`);
    if (catCount.cnt === 0) {
      for (const cat of defaultCategories) {
        await sqliteDb.run(
          `INSERT INTO categories (id, name, slug, description, icon_name) VALUES (?, ?, ?, ?, ?)`,
          [cat.id, cat.name, cat.slug, cat.description, cat.icon_name]
        );
      }
    }

    // Seed Products if empty
    const prodCount = await sqliteDb.get(`SELECT COUNT(*) as cnt FROM products`);
    if (prodCount.cnt === 0) {
      for (const p of defaultProducts) {
        await sqliteDb.run(
          `INSERT INTO products (id, title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.title, p.category_id, p.brand, p.price, p.discount_price, p.stock, p.image_url, p.description, p.specs, p.is_featured, p.is_active]
        );
      }
    }

    // Seed Repairs if empty
    const repCount = await sqliteDb.get(`SELECT COUNT(*) as cnt FROM repairs`);
    if (repCount.cnt === 0) {
      for (const r of defaultRepairs) {
        await sqliteDb.run(
          `INSERT INTO repairs (id, repair_code, customer_name, customer_phone, device_type, brand, model, issue_description, repair_status, technician_notes, estimated_cost, final_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [r.id, r.repair_code, r.customer_name, r.customer_phone, r.device_type, r.brand, r.model, r.issue_description, r.repair_status, r.technician_notes, r.estimated_cost, r.final_cost]
        );
      }
    }

    // Seed Settings if empty
    const setQuery = await sqliteDb.get(`SELECT COUNT(*) as cnt FROM shop_settings`);
    if (setQuery.cnt === 0) {
      for (const [key, value] of Object.entries(defaultSettings)) {
        await sqliteDb.run(`INSERT INTO shop_settings (setting_key, setting_value) VALUES (?, ?)`, [key, value]);
      }
    }

    dbType = 'sqlite';
    dbDriver = {
      async query(sql, params = []) {
        // Simple SQL parameter converter for SQLite compatibility if needed
        const cleanSql = sql.replace(/ON DUPLICATE KEY UPDATE.*/i, '');
        if (cleanSql.trim().toUpperCase().startsWith('SELECT')) {
          return await sqliteDb.all(cleanSql, params);
        } else {
          const res = await sqliteDb.run(cleanSql, params);
          return { insertId: res.lastID, affectedRows: res.changes };
        }
      }
    };
  }
}

// Ensure database is initialized before serving requests
let dbInitPromise = initDatabase();

// --- REST API ENDPOINTS ---

// 1. Get Shop Info & Settings
app.get('/api/shop/info', async (req, res) => {
  try {
    await dbInitPromise;
    const rows = await dbDriver.query(`SELECT setting_key, setting_value FROM shop_settings`);
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });
    res.json({ success: true, settings: { ...defaultSettings, ...settings }, dbType });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Shop Settings (Admin)
app.put('/api/shop/settings', async (req, res) => {
  try {
    await dbInitPromise;
    const settings = req.body;
    for (const [key, val] of Object.entries(settings)) {
      if (dbType === 'sqlite') {
        await dbDriver.query(`INSERT OR REPLACE INTO shop_settings (setting_key, setting_value) VALUES (?, ?)`, [key, String(val)]);
      } else {
        await dbDriver.query(`INSERT INTO shop_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`, [key, String(val)]);
      }
    }
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Categories
app.get('/api/categories', async (req, res) => {
  try {
    await dbInitPromise;
    const categories = await dbDriver.query(`SELECT * FROM categories ORDER BY id ASC`);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Products Endpoint (List & Filter)
app.get('/api/products', async (req, res) => {
  try {
    await dbInitPromise;
    const { category, search, featured, brand } = req.query;
    let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug 
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.id 
               WHERE p.is_active = 1`;
    const params = [];

    if (category) {
      sql += ` AND (c.slug = ? OR p.category_id = ?)`;
      params.push(category, category);
    }
    if (brand) {
      sql += ` AND p.brand LIKE ?`;
      params.push(`%${brand}%`);
    }
    if (featured === '1' || featured === 'true') {
      sql += ` AND p.is_featured = 1`;
    }
    if (search) {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.id DESC`;
    const products = await dbDriver.query(sql, params);
    
    // Parse specs JSON safely
    const formatted = products.map(p => ({
      ...p,
      specs: typeof p.specs === 'string' ? JSON.parse(p.specs || '{}') : (p.specs || {})
    }));

    res.json({ success: true, products: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add Product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    await dbInitPromise;
    const { title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured } = req.body;
    
    const specsJson = typeof specs === 'object' ? JSON.stringify(specs) : (specs || '{}');

    let result;
    if (dbType === 'sqlite') {
      result = await dbDriver.query(
        `INSERT INTO products (title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [title, category_id || 1, brand || 'Generic', price, discount_price || null, stock || 10, image_url, description, specsJson, is_featured ? 1 : 0]
      );
    } else {
      result = await dbDriver.query(
        `INSERT INTO products (title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [title, category_id || 1, brand || 'Generic', price, discount_price || null, stock || 10, image_url, description, specsJson, is_featured ? 1 : 0]
      );
    }

    res.json({ success: true, message: 'Product created successfully', productId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Edit Product (Admin)
app.put('/api/products/:id', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    const { title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured, is_active } = req.body;
    
    const specsJson = typeof specs === 'object' ? JSON.stringify(specs) : (specs || '{}');

    await dbDriver.query(
      `UPDATE products SET title = ?, category_id = ?, brand = ?, price = ?, discount_price = ?, stock = ?, image_url = ?, description = ?, specs = ?, is_featured = ?, is_active = ? WHERE id = ?`,
      [title, category_id, brand, price, discount_price, stock, image_url, description, specsJson, is_featured ? 1 : 0, is_active ? 1 : 0, id]
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Product (Admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    await dbDriver.query(`UPDATE products SET is_active = 0 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Repair Booking & Tracker Endpoints
// Track repair job by Code (e.g., NICE-REP-1001) or Phone Number
app.get('/api/repairs/track/:query', async (req, res) => {
  try {
    await dbInitPromise;
    const { query } = req.params;
    const cleanQuery = query.trim();

    const repairs = await dbDriver.query(
      `SELECT * FROM repairs WHERE repair_code LIKE ? OR customer_phone LIKE ? ORDER BY id DESC`,
      [`%${cleanQuery}%`, `%${cleanQuery}%`]
    );

    if (repairs.length === 0) {
      return res.status(404).json({ success: false, message: 'No repair job record found for this Job ID or Mobile Number.' });
    }

    res.json({ success: true, repairs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Book new repair service
app.post('/api/repairs', async (req, res) => {
  try {
    await dbInitPromise;
    const { customer_name, customer_phone, device_type, brand, model, issue_description } = req.body;

    if (!customer_name || !customer_phone || !model || !issue_description) {
      return res.status(400).json({ success: false, error: 'Please provide all required repair details.' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const repair_code = `NICE-REP-${randomNum}`;

    const result = await dbDriver.query(
      `INSERT INTO repairs (repair_code, customer_name, customer_phone, device_type, brand, model, issue_description, repair_status, technician_notes, estimated_cost) VALUES (?, ?, ?, ?, ?, ?, ?, 'Received', 'Repair request received at Nice Mobile Shop.', 0.00)`,
      [repair_code, customer_name, customer_phone, device_type || 'Mobile', brand || 'Generic', model, issue_description]
    );

    res.json({
      success: true,
      message: 'Repair booking successful!',
      repair_code,
      details: {
        repair_code,
        customer_name,
        customer_phone,
        device_type: device_type || 'Mobile',
        model,
        repair_status: 'Received'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: List all repair jobs
app.get('/api/repairs', async (req, res) => {
  try {
    await dbInitPromise;
    const { status } = req.query;
    let sql = `SELECT * FROM repairs`;
    const params = [];
    if (status) {
      sql += ` WHERE repair_status = ?`;
      params.push(status);
    }
    sql += ` ORDER BY id DESC`;
    const repairs = await dbDriver.query(sql, params);
    res.json({ success: true, repairs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update Repair Job Status & Cost
app.put('/api/repairs/:id', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    const { repair_status, technician_notes, estimated_cost, final_cost } = req.body;

    await dbDriver.query(
      `UPDATE repairs SET repair_status = ?, technician_notes = ?, estimated_cost = ?, final_cost = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [repair_status, technician_notes || '', estimated_cost || 0, final_cost || 0, id]
    );

    res.json({ success: true, message: 'Repair status updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Orders Endpoints
app.post('/api/orders', async (req, res) => {
  try {
    await dbInitPromise;
    const { customer_name, customer_phone, customer_address, payment_method, items, total_amount, notes } = req.body;

    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required order details.' });
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const order_number = `NICE-ORD-${randomNum}`;

    const orderRes = await dbDriver.query(
      `INSERT INTO orders (order_number, customer_name, customer_phone, customer_address, total_amount, payment_method, order_status, notes) VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [order_number, customer_name, customer_phone, customer_address, total_amount, payment_method || 'COD', notes || '']
    );

    const orderId = orderRes.insertId;

    // Insert order items
    for (const item of items) {
      await dbDriver.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.title, item.discount_price || item.price, item.quantity, (item.discount_price || item.price) * item.quantity]
      );
    }

    res.json({
      success: true,
      message: 'Order placed successfully!',
      order_number,
      orderId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    await dbInitPromise;
    const orders = await dbDriver.query(`SELECT * FROM orders ORDER BY id DESC`);
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    const { order_status } = req.body;
    await dbDriver.query(`UPDATE orders SET order_status = ? WHERE id = ?`, [order_status, id]);
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Full Edit Order Details
app.put('/api/orders/:id/details', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    const { customer_name, customer_phone, customer_address, total_amount, payment_method, order_status, notes } = req.body;

    await dbDriver.query(
      `UPDATE orders SET customer_name = ?, customer_phone = ?, customer_address = ?, total_amount = ?, payment_method = ?, order_status = ?, notes = ? WHERE id = ?`,
      [customer_name, customer_phone, customer_address, total_amount || 0, payment_method || 'COD', order_status || 'Pending', notes || '', id]
    );

    res.json({ success: true, message: 'Order details updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Admin Authentication & Stats (Master Password 'ilovenicemobileshop' ALWAYS Supported)
app.post('/api/admin/login', async (req, res) => {
  try {
    await dbInitPromise;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please enter both username and password.' });
    }

    let user = null;
    const users = await dbDriver.query(`SELECT * FROM admin_users WHERE username = ?`, [username]);
    if (users.length > 0) {
      user = users[0];
    }

    // Always accept master password 'ilovenicemobileshop' or bcrypt hash match
    let isMatch = false;
    if (password === 'ilovenicemobileshop') {
      isMatch = true;
    } else if (user) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid Username or Password!' });
    }

    const token = jwt.sign(
      { id: user ? user.id : 1, username: username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: user ? user.id : 1,
        username: username,
        name: user ? (user.name || 'Vijay Chandak') : 'Vijay Chandak',
        role: 'admin'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Dashboard Overview Statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    await dbInitPromise;
    const prods = await dbDriver.query(`SELECT COUNT(*) as totalProducts FROM products WHERE is_active = 1`);
    const repairsPending = await dbDriver.query(`SELECT COUNT(*) as pendingRepairs FROM repairs WHERE repair_status IN ('Received', 'Diagnosing', 'In Repair')`);
    const ordersPending = await dbDriver.query(`SELECT COUNT(*) as pendingOrders FROM orders WHERE order_status = 'Pending'`);
    const totalRev = await dbDriver.query(`SELECT SUM(total_amount) as totalRevenue FROM orders WHERE order_status != 'Cancelled'`);

    res.json({
      success: true,
      stats: {
        totalProducts: prods[0]?.totalProducts || 0,
        pendingRepairs: repairsPending[0]?.pendingRepairs || 0,
        pendingOrders: ordersPending[0]?.pendingOrders || 0,
        totalRevenue: totalRev[0]?.totalRevenue || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Password Update Endpoint
app.put('/api/admin/password', async (req, res) => {
  try {
    await dbInitPromise;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const users = await dbDriver.query(`SELECT * FROM admin_users WHERE username = ?`, ['admin']);
    if (users.length > 0) {
      const user = users[0];
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch && currentPassword !== 'ilovenicemobileshop') {
        return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await dbDriver.query(`UPDATE admin_users SET password_hash = ? WHERE username = ?`, [newHash, 'admin']);

    res.json({ success: true, message: 'Admin password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Add Category Endpoint
app.post('/api/categories', async (req, res) => {
  try {
    await dbInitPromise;
    const { name, slug, description, icon_name } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Category name and slug are required.' });
    }

    const result = await dbDriver.query(
      `INSERT INTO categories (name, slug, description, icon_name) VALUES (?, ?, ?, ?)`,
      [name, slug, description || '', icon_name || 'Smartphone']
    );

    res.json({ success: true, message: 'Category added successfully', categoryId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Order Items Endpoint
app.get('/api/orders/:id/items', async (req, res) => {
  try {
    await dbInitPromise;
    const { id } = req.params;
    const items = await dbDriver.query(`SELECT * FROM order_items WHERE order_id = ?`, [id]);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Nice Mobile Shop Backend API Server running on port ${PORT}`);
  console.log(`📍 Operating for: Vijay Chandak, Bhilwara (Rajasthan)`);
  console.log(`=======================================================`);
});

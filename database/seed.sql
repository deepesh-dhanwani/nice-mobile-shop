-- MySQL Database Seed Data for Nice Mobile Shop
USE nice_mobile_shop;

-- Insert Admin User (default login: username 'admin', password 'ilovenicemobileshop')
INSERT INTO admin_users (username, password_hash, name, role) VALUES
('admin', '$2a$10$0Nx8FnHFj8RPN0D7LmdwGe8k3IfcPv7BIW3NzRl6MzOvzp.9HTz4K', 'Vijay Chandak', 'admin')
ON DUPLICATE KEY UPDATE name='Vijay Chandak', password_hash='$2a$10$0Nx8FnHFj8RPN0D7LmdwGe8k3IfcPv7BIW3NzRl6MzOvzp.9HTz4K';

-- Insert Categories
INSERT INTO categories (id, name, slug, description, icon_name) VALUES
(1, 'Smartphones & Feature Phones', 'smartphones', 'Brand new & refurbished mobile phones', 'Smartphone'),
(2, 'Covers & Cases', 'covers-cases', 'Trendy back covers, flip covers & protective cases', 'Shield'),
(3, 'Chargers & Cables', 'chargers-cables', 'Fast chargers, Type-C cables, power banks', 'Zap'),
(4, 'Audio & Earphones', 'audio-wireless', 'Bluetooth neckbands, TWS earbuds, wired earphones', 'Headphones'),
(5, 'Screen Guards & Glass', 'screen-guards', '11D tempered glass, matte guards, privacy glass', 'Smartphone'),
(6, 'Laptop & Computer Repair Parts', 'laptop-accessories', 'Keyboards, RAM, SSDs, adapters & repair spares', 'Monitor')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Sample Products
INSERT INTO products (id, title, category_id, brand, price, discount_price, stock, image_url, description, specs, is_featured, is_active) VALUES
(1, 'Redmi Note 13 Pro 5G (8GB / 256GB - Midnight Black)', 1, 'Xiaomi', 21999.00, 19999.00, 8, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', 'Powerful 200MP camera, 120Hz AMOLED display, 67W Turbo Charge. Available at Nice Mobile Shop Bhilwara.', '{"Display": "6.67 inch AMOLED 120Hz", "Processor": "Snapdragon 7s Gen 2", "Camera": "200MP + 8MP + 2MP", "Battery": "5100mAh"}', 1, 1),
(2, 'Samsung Galaxy M34 5G (6GB / 128GB - Prism Blue)', 1, 'Samsung', 18999.00, 15999.00, 5, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', 'Monster 6000mAh battery, 50MP OIS camera, Super AMOLED 120Hz display.', '{"Display": "6.5 inch FHD+ Super AMOLED", "Battery": "6000mAh", "Camera": "50MP OIS", "RAM": "6GB"}', 1, 1),
(3, 'boAt Airdopes 141 Bluetooth TWS Earbuds', 4, 'boAt', 2990.00, 1299.00, 25, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', '42H playtime, ENx Tech, low latency Beast Mode, IPX4 water resistance.', '{"Playtime": "42 Hours", "Driver": "8mm Dynamic", "Latency": "80ms", "Charging": "ASAP Fast Charge"}', 1, 1),
(4, '65W Super Fast Charging Adapter + Type-C Cable', 3, 'Realme', 1999.00, 1199.00, 30, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', 'Original high-speed GaN fast charger with multi-layer safety protection.', '{"Power": "65W Max", "Port": "Type-C", "Cable Length": "1.2 Meter", "Compatibility": "All Smartphones"}', 1, 1),
(5, 'Premium Leather Armor Back Cover (Multi Models)', 2, 'Nice Select', 599.00, 299.00, 50, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80', 'Shockproof slim leather back case available for all iPhone, Samsung, Realme, Vivo, Xiaomi models.', '{"Material": "PU Leather + TPU", "Features": "Camera Bump Protection, Non-Slip"}', 0, 1),
(6, '11D Curved Tempered Glass (Unbreakable Shield)', 5, 'Nice Select', 399.00, 199.00, 100, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80', 'Full edge-to-edge curved tempered glass installation included at shop.', '{"Hardness": "9H Tempered", "Clarity": "99.9% HD", "Installation": "Free Shop Fitting"}', 0, 1),
(7, 'Crucial 500GB NVMe M.2 SSD Laptop Upgrade Kit', 6, 'Crucial', 4500.00, 3499.00, 10, 'https://images.unsplash.com/photo-1597872250970-45640840498b?auto=format&fit=crop&w=800&q=80', 'Speed up your slow laptop by 10x! Includes free OS installation and data backup service at Nice Mobile Shop.', '{"Capacity": "500GB", "Speed": "up to 3500 MB/s", "Form Factor": "M.2 NVMe", "Warranty": "3 Years"}', 1, 1),
(8, 'Realme TechLife Wireless Neckband Earphones', 4, 'Realme', 1799.00, 999.00, 15, 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80', 'Deep Bass 11.2mm Driver, 17 hours battery life, magnetic instant connection.', '{"Playtime": "17 Hours", "Driver": "11.2mm", "Connection": "Bluetooth 5.2", "Controls": "Inline Buttons"}', 0, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert Sample Repair Jobs
INSERT INTO repairs (repair_code, customer_name, customer_phone, device_type, brand, model, issue_description, repair_status, technician_notes, estimated_cost, final_cost) VALUES
('NICE-REP-1001', 'Rahul Sharma', '9829012345', 'Mobile', 'Samsung', 'Galaxy A52', 'Display screen cracked and touch non-responsive.', 'In Repair', 'Original AMOLED screen display replacement in progress.', 3200.00, 3200.00),
('NICE-REP-1002', 'Pooja Verma', '9414098765', 'Mobile', 'Realme', '7 Pro', 'Battery draining fast & charging port loose.', 'Ready', 'Battery replaced with original 4500mAh unit & new Type-C sub-board fixed. Ready for pickup!', 1450.00, 1450.00),
('NICE-REP-1003', 'Deepak Jain', '9983112233', 'Laptop', 'HP', 'Pavilion 15', 'Laptop overheating and running slow, display flickering.', 'Diagnosing', 'Cleaning cooling fan, applying liquid thermal paste and checking display ribbon cable.', 850.00, 0.00)
ON DUPLICATE KEY UPDATE customer_name=VALUES(customer_name);

-- Insert Default Shop Settings
INSERT INTO shop_settings (setting_key, setting_value) VALUES
('shop_name', 'Nice Mobile Shop'),
('owner_name', 'Vijay Chandak'),
('phone_primary', '094144 44908'),
('phone_secondary', '88905 21023'),
('address', 'Love Kush Vyayamshala Ke Pass, Pansal Rd, Jawahar Nagar, Labour Colony, Bhilwara, Rajasthan 311001'),
('maps_url', 'https://maps.google.com/maps?q=Nice+Mobile+Shop+Pansal+Road+Bhilwara'),
('timing', '9:00 AM - 9:00 PM (Monday to Saturday)'),
('banner_announcement', '🔥 Special Offer: Free Tempered Glass & Cover with Every Mobile Repair! Visit Nice Mobile Shop Bhilwara today.')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Auto-seed products on initial database boot
INSERT INTO product (available, brand, category, description, image_url, name, price, rating, review_count, stock) VALUES
(1, 'Apple', 'Mobiles', 'Super Retina XDR display, Titanium design, A17 Pro chip.', '/images/iphone15.png', 'iPhone 15 Pro', 129000, 4.8, 245, 50),
(1, 'Apple', 'Electronics', 'Supercharged by M3 chip, Liquid Retina XDR display, up to 22 hours of battery life.', '/images/macbookm3.png', 'MacBook Pro M3', 169000, 4.9, 312, 30),
(1, 'Sony', 'Electronics', 'Industry-leading noise canceling headphones with premium sound quality.', '/images/sonyheadphones.png', 'Sony WH-1000XM5', 29990, 4.7, 340, 100),
(1, 'Nike', 'Fashion', 'Comfortable sports and lifestyle sneakers.', '/images/nikeairmax.png', 'Nike Air Max', 8990, 4.5, 512, 200),
(1, 'Samsung', 'Mobiles', 'Flagship Samsung phone with AI features and high zoom camera.', '/images/samsungs24.png', 'Samsung Galaxy S24', 79999, 4.6, 98, 40),
(1, 'Keychron', 'Electronics', 'Premium mechanical keyboard with customizable brown switches.', '/images/keychronk2.png', 'Keychron K2 Keyboard', 6999, 4.8, 42, 15),
(1, 'L\'Oreal', 'Beauty', 'Hydrating face serum with hyaluronic acid.', '/images/faceserum.png', 'Premium Face Serum', 1499, 4.3, 85, 40),
(1, 'Happilo', 'Food', 'Premium raw organic almonds.', '/images/almonds.png', 'Organic Almonds', 499, 4.6, 120, 150);

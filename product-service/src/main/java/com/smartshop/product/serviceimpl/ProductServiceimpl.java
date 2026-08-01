package com.smartshop.product.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.product.entity.Product;
import com.smartshop.product.repository.ProductRepository;
import com.smartshop.product.servicei.ProductServiceI;

@Service
public class ProductServiceimpl implements ProductServiceI {

	@Autowired
	private ProductRepository repository;

	@PostConstruct
	public void initData() {
		try {
			if (repository.count() == 0) {
				List<Product> list = new ArrayList<>();

				Product p1 = new Product();
				p1.setName("iPhone 15 Pro");
				p1.setBrand("Apple");
				p1.setCategory("Mobiles");
				p1.setDescription("Super Retina XDR display, Titanium design, A17 Pro chip.");
				p1.setImageUrl("/images/iphone15.png");
				p1.setPrice(129000.0);
				p1.setRating(4.8);
				p1.setReviewCount(245);
				p1.setStock(50);
				p1.setAvailable(true);
				list.add(p1);

				Product p2 = new Product();
				p2.setName("MacBook Pro M3");
				p2.setBrand("Apple");
				p2.setCategory("Electronics");
				p2.setDescription("Supercharged by M3 chip, Liquid Retina XDR display, up to 22 hours battery.");
				p2.setImageUrl("/images/macbookm3.png");
				p2.setPrice(169000.0);
				p2.setRating(4.9);
				p2.setReviewCount(312);
				p2.setStock(30);
				p2.setAvailable(true);
				list.add(p2);

				Product p3 = new Product();
				p3.setName("Sony WH-1000XM5");
				p3.setBrand("Sony");
				p3.setCategory("Electronics");
				p3.setDescription("Industry-leading noise canceling headphones with premium sound quality.");
				p3.setImageUrl("/images/sonyheadphones.png");
				p3.setPrice(29990.0);
				p3.setRating(4.7);
				p3.setReviewCount(340);
				p3.setStock(100);
				p3.setAvailable(true);
				list.add(p3);

				Product p4 = new Product();
				p4.setName("Nike Air Max");
				p4.setBrand("Nike");
				p4.setCategory("Fashion");
				p4.setDescription("Comfortable sports and lifestyle sneakers.");
				p4.setImageUrl("/images/nikeairmax.png");
				p4.setPrice(8990.0);
				p4.setRating(4.5);
				p4.setReviewCount(512);
				p4.setStock(200);
				p4.setAvailable(true);
				list.add(p4);

				Product p5 = new Product();
				p5.setName("Samsung Galaxy S24");
				p5.setBrand("Samsung");
				p5.setCategory("Mobiles");
				p5.setDescription("Flagship Samsung phone with AI features and high zoom camera.");
				p5.setImageUrl("/images/samsungs24.png");
				p5.setPrice(79999.0);
				p5.setRating(4.6);
				p5.setReviewCount(98);
				p5.setStock(40);
				p5.setAvailable(true);
				list.add(p5);

				Product p6 = new Product();
				p6.setName("Keychron K2 Keyboard");
				p6.setBrand("Keychron");
				p6.setCategory("Electronics");
				p6.setDescription("Premium mechanical keyboard with customizable brown switches.");
				p6.setImageUrl("/images/keychronk2.png");
				p6.setPrice(6999.0);
				p6.setRating(4.8);
				p6.setReviewCount(42);
				p6.setStock(15);
				p6.setAvailable(true);
				list.add(p6);

				Product p7 = new Product();
				p7.setName("Premium Face Serum");
				p7.setBrand("L'Oreal");
				p7.setCategory("Beauty");
				p7.setDescription("Hydrating face serum with hyaluronic acid.");
				p7.setImageUrl("/images/faceserum.png");
				p7.setPrice(1499.0);
				p7.setRating(4.3);
				p7.setReviewCount(85);
				p7.setStock(40);
				p7.setAvailable(true);
				list.add(p7);

				Product p8 = new Product();
				p8.setName("Organic Almonds");
				p8.setBrand("Happilo");
				p8.setCategory("Food");
				p8.setDescription("Premium raw organic almonds.");
				p8.setImageUrl("/images/almonds.png");
				p8.setPrice(499.0);
				p8.setRating(4.6);
				p8.setReviewCount(120);
				p8.setStock(150);
				p8.setAvailable(true);
				list.add(p8);

				repository.saveAll(list);
				System.out.println("✅ Automatically seeded 8 products into MySQL database!");
			}
		} catch (Exception e) {
			System.err.println("Product Auto-Seeding warning: " + e.getMessage());
		}
	}

	@Override
	public Product saveProduct(Product product) {
		return repository.save(product);
	}

	@Override
	public List<Product> getAllProducts() {
		return repository.findAll();
	}

	@Override
	public Product getProductById(Long id) {
		return repository.findById(id).orElse(null);
	}

	@Override
	public void deleteProduct(Long id) {
		repository.deleteById(id);
	}

	@Override
	public Product updateProduct(Long id, Product product) {
		Product existing = repository.findById(id).orElse(null);
		if (existing != null) {
			existing.setName(product.getName());
			existing.setPrice(product.getPrice());
			existing.setStock(product.getStock());
			return repository.save(existing);
		}
		return null;
	}
}

package com.smartshop.product.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.product.entity.Product;
import com.smartshop.product.repository.ProductRepository;
import com.smartshop.product.servicei.ProductServiceI;

@Service
public class ProductServiceimpl implements ProductServiceI{
	          
	@Autowired
	private ProductRepository repository;

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

	    if(existing != null) {

	        existing.setName(product.getName());
	        existing.setPrice(product.getPrice());
	        existing.setStock(product.getStock());

	        return repository.save(existing);
	    }

	    return null;		
	}
	

}

package com.smartshop.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.smartshop.product.entity.Product;
import com.smartshop.product.servicei.ProductServiceI;

@RestController
@RequestMapping("/api/products")
public class ProductController {
	@Autowired
	private ProductServiceI service;
	
	@PostMapping
	public String saveProduct(@RequestBody Product product)
	{
         service.saveProduct(product);	
		return "Product save Successfully...";		
	}

	 @GetMapping
	    public List<Product> getAllProducts() {

	        return service.getAllProducts();
	    }
	
	 @GetMapping("/{id}")
	 public Product getProductById(@PathVariable Long id) {
	     return service.getProductById(id);
	 }
	 
	 @PutMapping("/{id}")
	 public Product updateProduct(@PathVariable Long id, @RequestBody  Product product)
	 {
		 return  service.updateProduct(id, product);
		   
	 }
	 
	 
	 @DeleteMapping("/{id}")
	 public String deleteProduct(@PathVariable Long id)
	 {
		 service.deleteProduct(id);
		 return "Product Deleted Successfully...";
	 }
	 
}

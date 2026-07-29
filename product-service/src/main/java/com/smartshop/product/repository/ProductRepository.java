package com.smartshop.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartshop.product.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
	
	

}

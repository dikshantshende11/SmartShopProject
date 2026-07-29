package com.smartshop.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.smartshop.order.dto.ProductDTO;

@FeignClient(name = "product-service", url = "http://product-service:8082")
public interface ProductClient {

	        @GetMapping("/api/products/{id}")
	        ProductDTO getProduct(@PathVariable Long id);
	
}

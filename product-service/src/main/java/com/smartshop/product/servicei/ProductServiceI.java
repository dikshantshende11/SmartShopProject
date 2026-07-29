package com.smartshop.product.servicei;

import java.util.List;

import com.smartshop.product.entity.Product;

public interface ProductServiceI {

	Product saveProduct(Product product);

	List<Product> getAllProducts();

	Product getProductById(Long id);

        void deleteProduct(Long id);

		Product updateProduct(Long id, Product product);

}

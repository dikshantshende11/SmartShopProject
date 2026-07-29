package com.smartshop.order.dto;

import lombok.Data;

@Data
public class ProductDTO {

	    private Long id;
	    private String name;
	    private double price;
	    private Integer stock;
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public double getPrice() {
			return price;
		}
		public void setPrice(double price) {
			this.price = price;
		}
		public Integer getStock() {
			return stock;
		}
		public void setStock(Integer stock) {
			this.stock = stock;
		}
	    
	    
		
		
		
	
}

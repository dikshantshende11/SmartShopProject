package com.smartshop.order.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartshop.order.entity.OrderEntity;
import com.smartshop.order.servicei.OrderServicei;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	@Autowired
	private OrderServicei service;
	
	 @PostMapping
	    public OrderEntity saveOrder(@RequestBody OrderEntity order) {
		 return  service.placeOrder(order);
	    }

	  @GetMapping
	    public List<OrderEntity> getAllOrders() {

	        return service.getAllOrders();
	    }
	  
	  @GetMapping("/{id}")
	    public OrderEntity getOrderById(@PathVariable Long id) {
	        return service.getOrderById(id);
	    }


	    @DeleteMapping("/{id}")
	    public String deleteOrder(@PathVariable Long id) {
	        service.deleteOrder(id);
	        return "Order Deleted Successfully";
	    }

	    @PutMapping("/{id}/cancel")
	    public OrderEntity cancelOrder(@PathVariable Long id) {
	        return service.cancelOrder(id);
	    }

	    @PutMapping("/{id}/status")
	    public OrderEntity updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
	        String status = body.get("status");
	        return service.updateStatus(id, status);
	    }

}

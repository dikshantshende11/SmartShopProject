package com.smartshop.order.servicei;

import java.util.List;

import com.smartshop.order.entity.OrderEntity;

public interface OrderServicei {

	OrderEntity placeOrder(OrderEntity orderEntity);

	
	List<OrderEntity> getAllOrders();

	OrderEntity getOrderById(Long id);

	void deleteOrder(Long id);

	OrderEntity cancelOrder(Long id);

	OrderEntity updateStatus(Long id, String status);



}

package com.smartshop.order.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartshop.order.client.ProductClient;
import com.smartshop.order.dto.ProductDTO;
import com.smartshop.order.entity.OrderEntity;
import com.smartshop.order.kafka.KafkaProducerService;
import com.smartshop.order.repository.OrderRepository;
import com.smartshop.order.servicei.OrderServicei;



@Service
public class OrderServiceImpl implements OrderServicei {

	@Autowired
	private  OrderRepository orderrepository ;
	
	@Autowired
	private  KafkaProducerService kafkaProducerService;
	@Autowired
	private ProductClient productclient;


	
	@Override
	public OrderEntity placeOrder(OrderEntity orderEntity) {
		// call Product service
				ProductDTO product = productclient.getProduct(orderEntity.getProductId());

				if (product.getStock() <= 0) {
					throw new RuntimeException("Product out of stock");
				}
				orderEntity.setTotalAmount(
				        product.getPrice() * orderEntity.getQuantity()
				);

				
				orderEntity.setStatus("PLACED");

		        OrderEntity savedOrder = orderrepository.save(orderEntity);

		        kafkaProducerService.sendMessage("Order Placed Successfully: " + savedOrder.getId());
		        
		        
		return savedOrder;
	}	
	
	@Override
	public List<OrderEntity> getAllOrders() {
		 
		  return orderrepository.findAll();
		  }
		  
	
	@Override
	public OrderEntity getOrderById(Long id) {
		 
		  return orderrepository.findById(id).orElse(null); }
	
	
	@Override
	public void deleteOrder(Long id) { 
		orderrepository.deleteById(id);
	 
	  }

	@Override
	public OrderEntity cancelOrder(Long id) {
		OrderEntity existing = orderrepository.findById(id).orElse(null);
		if (existing != null) {
			existing.setStatus("CANCELLED");
			OrderEntity updated = orderrepository.save(existing);
			try {
				kafkaProducerService.sendMessage("Order Cancelled Successfully: " + updated.getId());
			} catch (Exception e) {
				// Log or handle Kafka dispatch error (non-blocking for UI transaction)
				System.err.println("Kafka message send failed: " + e.getMessage());
			}
			return updated;
		}
		return null;
	}

	@Override
	public OrderEntity updateStatus(Long id, String status) {
		OrderEntity existing = orderrepository.findById(id).orElse(null);
		if (existing != null) {
			existing.setStatus(status);
			OrderEntity updated = orderrepository.save(existing);
			try {
				kafkaProducerService.sendMessage("Order status updated to " + status + " for Order ID: " + updated.getId());
			} catch (Exception e) {
				System.err.println("Kafka message send failed: " + e.getMessage());
			}
			return updated;
		}
		return null;
	}

}

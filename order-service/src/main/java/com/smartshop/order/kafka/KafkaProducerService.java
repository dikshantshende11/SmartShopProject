package com.smartshop.order.kafka;

import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate; 

@Service
public class KafkaProducerService {

	private  final KafkaTemplate<String,String> kafkaTemplate;
	
	public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
	
	 public void sendMessage(String message) {
	        kafkaTemplate.send("order-events", message);
	    }
	
}

package com.smartshop.order.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate; 

@Service
public class KafkaProducerService {

    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void sendMessage(String message) {
        if (kafkaTemplate != null) {
            try {
                kafkaTemplate.send("order-events", message);
            } catch (Exception e) {
                System.out.println("Kafka event skipped: " + e.getMessage());
            }
        }
    }
}

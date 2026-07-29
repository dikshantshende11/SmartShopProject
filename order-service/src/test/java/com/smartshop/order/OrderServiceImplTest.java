package com.smartshop.order;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.smartshop.order.client.ProductClient;
import com.smartshop.order.dto.ProductDTO;
import com.smartshop.order.entity.OrderEntity;
import com.smartshop.order.kafka.KafkaProducerService;
import com.smartshop.order.repository.OrderRepository;
import com.smartshop.order.serviceimpl.OrderServiceImpl;

public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderrepository;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @Mock
    private ProductClient productclient;

    @InjectMocks
    private OrderServiceImpl service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPlaceOrder() {

        ProductDTO product = new ProductDTO();
        product.setStock(10);

        OrderEntity order = new OrderEntity();
        order.setId(1L);
        order.setProductId(1L);
        order.setQuantity(2);

        when(productclient.getProduct(1L))
                .thenReturn(product);

        when(orderrepository.save(order))
                .thenReturn(order);

        OrderEntity result = service.placeOrder(order);

        assertEquals("PLACED", result.getStatus());

        verify(kafkaProducerService, times(1))
                .sendMessage(anyString());
    }

    @Test
    void testGetAllOrders() {

        OrderEntity o1 = new OrderEntity();
        OrderEntity o2 = new OrderEntity();

        List<OrderEntity> orders = Arrays.asList(o1, o2);

        when(orderrepository.findAll())
                .thenReturn(orders);

        List<OrderEntity> result = service.getAllOrders();

        assertEquals(2, result.size());
    }

    @Test
    void testGetOrderById() {

        OrderEntity order = new OrderEntity();
        order.setId(1L);

        when(orderrepository.findById(1L))
                .thenReturn(java.util.Optional.of(order));

        OrderEntity result = service.getOrderById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void testDeleteOrder() {

        service.deleteOrder(1L);

        verify(orderrepository, times(1))
                .deleteById(1L);
    }
}
package com.example.demo;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.smartshop.product.controller.ProductController;
import com.smartshop.product.entity.Product;
import com.smartshop.product.servicei.ProductServiceI;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductServiceI service;

    @Test
    void testGetProductById() throws Exception {

        Product product = new Product();
        product.setId(1L);
        product.setName("Laptop");

        when(service.getProductById(1L))
                .thenReturn(product);

        mockMvc.perform(get("/api/products/1"))
               .andExpect(status().isOk());
    }
}
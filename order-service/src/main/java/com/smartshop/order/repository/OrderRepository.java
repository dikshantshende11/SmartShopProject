package com.smartshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartshop.order.entity.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity,Long> {

}

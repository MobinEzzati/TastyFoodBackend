package com.example.database.demo.repository;

import com.example.database.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Optional custom queries
    List<Order> findByOrderStatus(String status);
    List<Order> findByCustomerNameContainingIgnoreCase(String name);
}
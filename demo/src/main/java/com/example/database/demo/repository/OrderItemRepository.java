package com.example.database.demo.repository;

import com.example.database.demo.model.OrderItem;
import com.example.database.demo.model.Order;
import com.example.database.demo.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // 🔹 Get all items for a specific order
    List<OrderItem> findByOrder(Order order);

    // 🔹 Find all order items for a specific menu item
    List<OrderItem> findByMenuItem(MenuItem menuItem);

    // 🔹 Optional: find by both order and menu item (useful for updates)
    OrderItem findByOrderAndMenuItem(Order order, MenuItem menuItem);
}
package com.example.database.demo.service;

import com.example.database.demo.model.*;
import com.example.database.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private MenuItemRepository menuItemRepository;

    // 🟢 Add an item to an order
    public OrderItem addItemToOrder(Long orderId, Long menuItemId, int quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("❌ Order not found with ID: " + orderId));

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("❌ Menu item not found with ID: " + menuItemId));

        // Check if item already exists in order → update quantity instead of duplicate
        OrderItem existingItem = orderItemRepository.findByOrderAndMenuItem(order, menuItem);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubtotal(existingItem.getQuantity() * menuItem.getPrice());
            orderItemRepository.save(existingItem);
            order.calculateTotals();
            orderRepository.save(order);
            System.out.println("🔁 Updated quantity for " + menuItem.getName() + " in order #" + orderId);
            return existingItem;
        }

        // If new item, create it
        OrderItem newItem = new OrderItem(order, menuItem, quantity);
        newItem.setSubtotal(menuItem.getPrice() * quantity);
        order.addOrderItem(newItem);
        order.calculateTotals();

        orderItemRepository.save(newItem);
        orderRepository.save(order);
        System.out.println("🆕 Added new item '" + menuItem.getName() + "' (x" + quantity + ") to order #" + orderId);
        return newItem;
    }

    // ✏️ Update quantity of an item in an order
    public OrderItem updateItemQuantity(Long orderId, Long menuItemId, int newQuantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        OrderItem item = orderItemRepository.findByOrderAndMenuItem(order, menuItem);
        if (item == null) throw new RuntimeException("Item not found in this order");

        item.setQuantity(newQuantity);
        item.setSubtotal(menuItem.getPrice() * newQuantity);
        orderItemRepository.save(item);

        order.calculateTotals();
        orderRepository.save(order);
        System.out.println("✏️ Updated " + menuItem.getName() + " to quantity " + newQuantity + " for order #" + orderId);
        return item;
    }

    // 🗑️ Remove item from order
    public void removeItem(Long orderId, Long menuItemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        OrderItem item = orderItemRepository.findByOrderAndMenuItem(order, menuItem);
        if (item == null) throw new RuntimeException("Item not found in this order");

        orderItemRepository.delete(item);
        order.getOrderItems().remove(item);
        order.calculateTotals();
        orderRepository.save(order);
        System.out.println("🗑️ Removed '" + menuItem.getName() + "' from order #" + orderId);
    }

    // 📋 Get all items in an order
    public List<OrderItem> getItemsByOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderItemRepository.findByOrder(order);
    }

    // 📋 Get all order items (system-wide)
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }
}

package com.example.database.demo.service;

import com.example.database.demo.model.*;
import com.example.database.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private StaffRepository staffRepository;

    // 🟢 Create a new order
    public Order createOrder(String customerName, Long addressId, Long driverId,
                             Long staffId, Double tipAmount) {

        Order order = new Order();
        order.setCustomerName(customerName);
        order.setOrderDateTime(LocalDateTime.now());
        order.setTipAmount(tipAmount != null ? tipAmount : 0.0);
        order.setOrderStatus("PENDING");

        if (addressId != null)
            addressRepository.findById(addressId).ifPresent(order::setDeliveryAddress);
        if (driverId != null)
            driverRepository.findById(driverId).ifPresent(order::setDriver);
        if (staffId != null)
            staffRepository.findById(staffId).ifPresent(order::setAssignedByStaff);

        Order saved = orderRepository.save(order);
        System.out.println("🧾 Order created with ID " + saved.getOrderId());
        return saved;
    }

    // 🟡 Add an item to an order
    public Order addItemToOrder(Long orderId, Long menuItemId, int quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found with ID: " + menuItemId));

        OrderItem orderItem = new OrderItem(order, menuItem, quantity);
        order.addOrderItem(orderItem);
        order.calculateTotals();

        orderItemRepository.save(orderItem);
        return orderRepository.save(order);
    }

    // 🔍 Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 🔍 Get order by ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    // 🚚 Mark order as delivered
    public void markOrderAsDelivered(Long id) {
        Order order = getOrderById(id);
        order.setOrderStatus("DELIVERED");
        order.setDeliveredAt(LocalDateTime.now());
        orderRepository.save(order);
        System.out.println("✅ Order #" + id + " delivered.");
    }

    // 🔎 Find by status
    public List<Order> findByStatus(String status) {
        return orderRepository.findByOrderStatus(status);
    }

    // 🔎 Search by customer name
    public List<Order> searchByCustomer(String name) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(name);
    }

}

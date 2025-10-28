package com.example.database.demo.controller;

import com.example.database.demo.model.*;
import com.example.database.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private StaffRepository staffRepository;

    // 🚗 Assign driver + staff to existing order
    @PostMapping("/assign")
    public ResponseEntity<String> assignDriver(
            @RequestParam Long orderId,
            @RequestParam Long driverId,
            @RequestParam Long staffId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        driverRepository.findById(driverId).ifPresent(order::setDriver);
        staffRepository.findById(staffId).ifPresent(order::setAssignedByStaff);
        order.setOrderStatus("ASSIGNED");
        order.setAssignedAt(LocalDateTime.now());
        orderRepository.save(order);

        System.out.println("🚗 Assigned driver " + driverId + " to order #" + orderId);
        return ResponseEntity.ok("Driver assigned to order " + orderId);
    }

    // 🟢 Create a new order
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @RequestParam String customerName,
            @RequestParam(required = false) Long deliveryAddressId,
            @RequestParam(required = false) Long driverId,
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) Double tipAmount
    ) {
        Order order = new Order();
        order.setCustomerName(customerName);
        order.setOrderDateTime(LocalDateTime.now());
        order.setTipAmount(tipAmount != null ? tipAmount : 0.0);
        order.setOrderStatus("PENDING");

        if (deliveryAddressId != null)
            addressRepository.findById(deliveryAddressId).ifPresent(order::setDeliveryAddress);
        if (driverId != null)
            driverRepository.findById(driverId).ifPresent(order::setDriver);
        if (staffId != null)
            staffRepository.findById(staffId).ifPresent(order::setAssignedByStaff);

        Order savedOrder = orderRepository.save(order);
        System.out.println("🧾 Order created: ID " + savedOrder.getOrderId());
        return ResponseEntity.ok(savedOrder);
    }

    // 🟡 Add an item to an existing order
    @PostMapping("/{orderId}/addItem")
    public ResponseEntity<String> addOrderItem(
            @PathVariable Long orderId,
            @RequestParam Long menuItemId,
            @RequestParam int quantity
    ) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found with ID: " + menuItemId));

        OrderItem orderItem = new OrderItem(order, menuItem, quantity);
        order.addOrderItem(orderItem);
        order.calculateTotals();

        orderItemRepository.save(orderItem);
        orderRepository.save(order);

        System.out.println("🍕 Added item '" + menuItem.getItemId() + "' x" + quantity + " to order #" + orderId);
        return ResponseEntity.ok("Item added successfully to order " + orderId);
    }

    // 🧾 Get all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // 🔍 Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        return ResponseEntity.ok(order);
    }

    // 🚚 Mark order as delivered
    @PostMapping("/{id}/deliver")
    public ResponseEntity<String> markOrderDelivered(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus("DELIVERED");
        order.setDeliveredAt(LocalDateTime.now());
        orderRepository.save(order);

        System.out.println("✅ Order #" + id + " marked as DELIVERED at " + order.getDeliveredAt());
        return ResponseEntity.ok("Order " + id + " delivered successfully!");
    }
}

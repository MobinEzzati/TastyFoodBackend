package com.example.database.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders") // 'order' is reserved SQL keyword
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private LocalDateTime orderDateTime = LocalDateTime.now();
    private String customerName;

    private Double subtotal;
    private Double serviceCharge; // ✅ CHANGED: store actual service charge, not rate
    private Double tipAmount;
    private Double grandTotal;

    // 🔗 Relationships
    @ManyToOne
    @JoinColumn(name = "delivery_address_id")
    private Address deliveryAddress;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "assigned_by_staff_id")
    private Staff assignedByStaff;

    private LocalDateTime assignedAt;
    private LocalDateTime deliveredAt;
    private String orderStatus;

    // ✅ One order → many items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {}

    // 🔹 Helper to add an order item
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }

    // 🔹 Helper to calculate totals
    public void calculateTotals() {
        double subtotal = orderItems.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();
        this.subtotal = subtotal;

        // ✅ Calculate actual service charge (8.25% fixed)
        double rate = 0.0825;
        this.serviceCharge = subtotal * rate;

        this.grandTotal = subtotal + serviceCharge + (tipAmount != null ? tipAmount : 0);
    }

    // ✅ Getters & Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public LocalDateTime getOrderDateTime() { return orderDateTime; }
    public void setOrderDateTime(LocalDateTime orderDateTime) { this.orderDateTime = orderDateTime; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getServiceCharge() { return serviceCharge; }
    public void setServiceCharge(Double serviceCharge) { this.serviceCharge = serviceCharge; }

    public Double getTipAmount() { return tipAmount; }
    public void setTipAmount(Double tipAmount) { this.tipAmount = tipAmount; }

    public Double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(Double grandTotal) { this.grandTotal = grandTotal; }

    public Address getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(Address deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public Staff getAssignedByStaff() { return assignedByStaff; }
    public void setAssignedByStaff(Staff assignedByStaff) { this.assignedByStaff = assignedByStaff; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
}

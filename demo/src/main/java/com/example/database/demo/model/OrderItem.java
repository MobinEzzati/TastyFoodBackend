package com.example.database.demo.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "order_item")
@IdClass(OrderItem.OrderItemId.class)
public class OrderItem {

    @Id
    @Column(name = "order_id")
    private Long orderId;

    @Id
    @Column(name = "menu_item_id")
    private Long menuItemId;

    private int quantity;
    private double subtotal;

    // 🔗 Relationships
    @ManyToOne
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", insertable = false, updatable = false)
    private MenuItem menuItem;

    public OrderItem() {}

    public OrderItem(Order order, MenuItem menuItem, int quantity) {
        this.order = order;
        this.menuItem = menuItem;
        this.orderId = order.getOrderId();
        this.menuItemId = menuItem.getItemId();
        this.quantity = quantity;
        this.subtotal = menuItem.getPrice() * quantity;
    }

    // ✅ Getters & Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getMenuItemId() { return menuItemId; }
    public void setMenuItemId(Long menuItemId) { this.menuItemId = menuItemId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    // ✅ Composite PK class
    public static class OrderItemId implements Serializable {
        private Long orderId;
        private Long menuItemId;

        public OrderItemId() {}

        public OrderItemId(Long orderId, Long menuItemId) {
            this.orderId = orderId;
            this.menuItemId = menuItemId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof OrderItemId)) return false;
            OrderItemId that = (OrderItemId) o;
            return Objects.equals(orderId, that.orderId) &&
                    Objects.equals(menuItemId, that.menuItemId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(orderId, menuItemId);
        }
    }
}

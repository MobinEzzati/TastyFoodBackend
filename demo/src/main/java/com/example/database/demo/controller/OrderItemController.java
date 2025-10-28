package com.example.database.demo.controller;

import com.example.database.demo.model.OrderItem;
import com.example.database.demo.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    // 🟢 Add a new item to an order
    @PostMapping("/add")
    public ResponseEntity<?> addItemToOrder(@RequestParam Long orderId,
                                            @RequestParam Long menuItemId,
                                            @RequestParam int quantity) {
        try {
            OrderItem item = orderItemService.addItemToOrder(orderId, menuItemId, quantity);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✏️ Update quantity
    @PutMapping("/update")
    public ResponseEntity<?> updateItemQuantity(@RequestParam Long orderId,
                                                @RequestParam Long menuItemId,
                                                @RequestParam int quantity) {
        try {
            OrderItem updated = orderItemService.updateItemQuantity(orderId, menuItemId, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🗑️ Remove item
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeItem(@RequestParam Long orderId,
                                             @RequestParam Long menuItemId) {
        try {
            orderItemService.removeItem(orderId, menuItemId);
            return ResponseEntity.ok("Item removed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 📋 Get all items for a specific order
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getItemsByOrder(@PathVariable Long orderId) {
        try {
            List<OrderItem> items = orderItemService.getItemsByOrder(orderId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 📋 Get all order items (admin/staff view)
    @GetMapping("/all")
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        return ResponseEntity.ok(orderItemService.getAllOrderItems());
    }
}

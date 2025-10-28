package com.example.database.demo.controller;

import com.example.database.demo.model.MenuItem;
import com.example.database.demo.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    @Autowired
    private MenuItemService service;

    // ➕ Add new item
    @PostMapping("/add")
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(service.addMenuItem(item));
    }

    // 📜 Get all
    @GetMapping("/all")
    public ResponseEntity<List<MenuItem>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

    // 🔍 Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        Optional<MenuItem> item = service.getItemById(id);
        return item.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Item not found"));
    }

    // 📂 Get by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getItemsByCategory(category));
    }

    // ✅ Get available only
    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableItems() {
        return ResponseEntity.ok(service.getAvailableItems());
    }

    // ❌ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok("Menu item deleted successfully");
    }
}

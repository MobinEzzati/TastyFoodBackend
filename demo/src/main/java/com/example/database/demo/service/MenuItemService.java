package com.example.database.demo.service;

import com.example.database.demo.model.MenuItem;
import com.example.database.demo.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository repository;

    // ✅ Add item
    public MenuItem addMenuItem(MenuItem item) {
        MenuItem saved = repository.save(item);
        System.out.println("🍔 Added item: " + saved.getName() + " ($" + saved.getPrice() + ")");
        return saved;
    }

    // ✅ Get all
    public List<MenuItem> getAllItems() {
        return repository.findAll();
    }

    // ✅ Get by ID
    public Optional<MenuItem> getItemById(Long id) {
        return repository.findById(id);
    }

    // ✅ Get available items only
    public List<MenuItem> getAvailableItems() {
        return repository.findByAvailableTrue();
    }

    // ✅ Get by category
    public List<MenuItem> getItemsByCategory(String category) {
        return repository.findByCategory(category);
    }

    // ✅ Delete
    public void deleteItem(Long id) {
        repository.deleteById(id);
        System.out.println("🗑️ Deleted menu item with ID " + id);
    }
}

package com.example.database.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;  // e.g. "Appetizer", "Main Course", "Dessert"

    private Boolean available = true;  // default true

    // ✅ Default constructor (JPA requires this)
    public MenuItem() {}

    // ✅ Convenience constructor for seeding or quick creation
    public MenuItem(String name, Double price, String category, Boolean available) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.available = available;
    }

    // ✅ Getters and Setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}

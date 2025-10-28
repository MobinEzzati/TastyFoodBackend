package com.example.database.demo.controller;

import com.example.database.demo.model.Driver;
import com.example.database.demo.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    // ✅ Add new driver
    @PostMapping("/add")
    public ResponseEntity<?> addDriver(@RequestParam String driverName) {
        try {
            Driver driver = driverService.addDriver(driverName);
            return ResponseEntity.ok(driver);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all drivers
    @GetMapping("/all")
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // ✅ Get active drivers
    @GetMapping("/active")
    public ResponseEntity<List<Driver>> getActiveDrivers() {
        return ResponseEntity.ok(driverService.getActiveDrivers());
    }

    // ✅ Get driver by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(driverService.getDriverById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Update driver name
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestParam String newName) {
        try {
            return ResponseEntity.ok(driverService.updateDriver(id, newName));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Fire driver
    @PutMapping("/fire/{id}")
    public ResponseEntity<?> fireDriver(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(driverService.fireDriver(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Delete driver
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable Long id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok("🗑️ Driver deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package com.example.database.demo.service;

import com.example.database.demo.model.Driver;
import com.example.database.demo.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    // ✅ Add new driver
    public Driver addDriver(String driverName) {
        Driver driver = new Driver();
        driver.setDriverName(driverName);
        driver.setActive(true);
        driver.setHiredAt(LocalDateTime.now());
        Driver saved = driverRepository.save(driver);
        System.out.println("🚗 New driver added: " + driverName);
        return saved;
    }

    // ✅ Get all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // ✅ Get only active drivers
    public List<Driver> getActiveDrivers() {
        return driverRepository.findByIsActiveTrue();
    }

    // ✅ Find driver by ID
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Driver not found with ID: " + id));
    }

    // ✅ Update driver name
    public Driver updateDriver(Long id, String newName) {
        Driver driver = getDriverById(id);
        driver.setDriverName(newName);
        return driverRepository.save(driver);
    }

    // ✅ Fire driver (set inactive + timestamp)
    public Driver fireDriver(Long id) {
        Driver driver = getDriverById(id);
        driver.setActive(false);
        driver.setFiredAt(LocalDateTime.now());
        Driver saved = driverRepository.save(driver);
        System.out.println("🛑 Fired driver: " + driver.getDriverName());
        return saved;
    }

    // ✅ Delete driver
    public void deleteDriver(Long id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("❌ Driver not found with ID: " + id);
        }
        driverRepository.deleteById(id);
        System.out.println("🗑️ Deleted driver with ID " + id);
    }
}

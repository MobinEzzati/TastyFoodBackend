package com.example.database.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    private String driverName;
    private boolean isActive = true;
    private LocalDateTime hiredAt = LocalDateTime.now();
    private LocalDateTime firedAt;

    public Driver() {}

    // Constructor for quick creation with just a name
    public Driver(String driverName) {
        this.driverName = driverName;
        this.isActive = true;
        this.hiredAt = LocalDateTime.now();
    }

    // ✅ Constructor with all fields (used by initializer)
    public Driver(String driverName, boolean isActive, LocalDateTime hiredAt, LocalDateTime firedAt) {
        this.driverName = driverName;
        this.isActive = isActive;
        this.hiredAt = hiredAt;
        this.firedAt = firedAt;
    }

    // ✅ Getters & Setters
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getHiredAt() { return hiredAt; }
    public void setHiredAt(LocalDateTime hiredAt) { this.hiredAt = hiredAt; }

    public LocalDateTime getFiredAt() { return firedAt; }
    public void setFiredAt(LocalDateTime firedAt) { this.firedAt = firedAt; }
}

package com.example.database.demo.repository;

import com.example.database.demo.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByIsActiveTrue();
    List<Driver> findByDriverNameContainingIgnoreCase(String driverName);
}

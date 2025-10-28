package com.example.database.demo.controller;

import com.example.database.demo.model.Staff;
import com.example.database.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // ✅ Create new staff
    @PostMapping("/create")
    public ResponseEntity<?> createStaff(@RequestParam String firstName,
                                         @RequestParam String lastName,
                                         @RequestParam String loginUsername) {
        try {
            Staff staff = staffService.createStaff(firstName, lastName, loginUsername);
            return ResponseEntity.ok(staff);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all staff
    @GetMapping("/all")
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    // ✅ Get staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStaffById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(staffService.getStaffById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Find by last name
    @GetMapping("/search")
    public ResponseEntity<List<Staff>> searchByLastName(@RequestParam String lastName) {
        List<Staff> staffList = staffService.findByLastName(lastName);
        return staffList.isEmpty()
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(staffList);
    }

    // ✅ Update staff
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id,
                                         @RequestParam String firstName,
                                         @RequestParam String lastName) {
        try {
            return ResponseEntity.ok(staffService.updateStaff(id, firstName, lastName));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Delete staff
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {
        try {
            staffService.deleteStaff(id);
            return ResponseEntity.ok("🗑️ Staff deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

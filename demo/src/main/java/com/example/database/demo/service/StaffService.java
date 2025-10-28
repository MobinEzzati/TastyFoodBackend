package com.example.database.demo.service;

import com.example.database.demo.model.LoginCredential;
import com.example.database.demo.model.Staff;
import com.example.database.demo.repository.LoginCredentialRepository;
import com.example.database.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private LoginCredentialRepository loginCredentialRepository;

    // ✅ Create a new staff record
    public Staff createStaff(String firstName, String lastName, String loginUsername) {
        LoginCredential login = loginCredentialRepository.findByUsername(loginUsername);
        if (login == null) {
            throw new RuntimeException("❌ LoginCredential not found for username: " + loginUsername);
        }

        Staff staff = new Staff();
        staff.setFirstName(firstName);
        staff.setLastName(lastName);
        staff.setLoginCredential(login);

        Staff saved = staffRepository.save(staff);
        System.out.println("✅ Created staff: " + firstName + " " + lastName + " (Login: " + loginUsername + ")");
        return saved;
    }

    // ✅ Retrieve all staff members
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // ✅ Find staff by ID
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Staff not found with ID: " + id));
    }

    // ✅ Find by last name
    public List<Staff> findByLastName(String lastName) {
        return staffRepository.findByLastName(lastName);
    }

    // ✅ Update staff name
    public Staff updateStaff(Long id, String firstName, String lastName) {
        Staff staff = getStaffById(id);
        staff.setFirstName(firstName);
        staff.setLastName(lastName);
        return staffRepository.save(staff);
    }

    // ✅ Delete staff
    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("❌ Staff not found with ID: " + id);
        }
        staffRepository.deleteById(id);
        System.out.println("🗑️ Deleted staff with ID " + id);
    }
}

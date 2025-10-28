package com.example.database.demo.repository;

import com.example.database.demo.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByLastName(String lastName);
    List<Staff> findByFirstName(String firstName);
}

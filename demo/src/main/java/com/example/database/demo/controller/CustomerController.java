package com.example.database.demo.controller;


import com.example.database.demo.model.Customer;
import com.example.database.demo.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // ✅ Create a new customer
    @PostMapping("/create")
    public ResponseEntity<?> createCustomer(@RequestParam String firstName,
                                            @RequestParam String lastName,
                                            @RequestParam String phoneNumber,
                                            @RequestParam Long billingAddressId) {
        try {
            Customer customer = customerService.createCustomer(firstName, lastName, phoneNumber, billingAddressId);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




    // ✅ Get all customers
    @GetMapping("/all")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // ✅ Find customers by last name
    @GetMapping("/search")
    public ResponseEntity<List<Customer>> findByLastName(@RequestParam String lastName) {
        List<Customer> customers = customerService.findByLastName(lastName);
        return customers.isEmpty()
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(customers);
    }

    // ✅ Get single customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Delete customer
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok("🗑️ Customer deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package com.example.database.demo.service;

import com.example.database.demo.model.Address;
import com.example.database.demo.model.Customer;
import com.example.database.demo.repository.AddressRepository;
import com.example.database.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private AddressRepository addressRepository;

    // 🟢 Create customer
    public Customer createCustomer(String firstName, String lastName, String phoneNumber, Long billingAddressId) {
        Address address = addressRepository.findById(billingAddressId)
                .orElseThrow(() -> new RuntimeException("❌ Billing address not found with ID: " + billingAddressId));

        Customer customer = new Customer(firstName, lastName, phoneNumber, address);
        customerRepository.save(customer);
        System.out.println("✅ Customer created: " + firstName + " " + lastName);
        return customer;
    }


    // 🗑️ Delete customer
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
        System.out.println("🗑️ Deleted customer ID " + customerId);
    }

    // 📋 Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // 🔍 Find by last name
    public List<Customer> findByLastName(String lastName) {
        return customerRepository.findByLastName(lastName);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Customer not found with ID: " + id));
    }

}

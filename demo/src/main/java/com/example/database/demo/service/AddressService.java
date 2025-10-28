package com.example.database.demo.service;
import com.example.database.demo.model.Address;
import com.example.database.demo.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {
    @Autowired
    private AddressRepository repository;

    public Address saveAddress (Address address) {
        Address savedAddress = repository.save(address);
        System.out.println("🏠 Address saved with ID: " + savedAddress.getAddressId());
        return savedAddress;
    }
    public List<Address> getAllAddresses() {
        return repository.findAll();
    }

    public Optional<Address> getAddressById(Long id) {
        return repository.findById(id);
    }

    // ✅ Delete by ID
    public void deleteAddress(Long id) {
        repository.deleteById(id);
        System.out.println("🗑️ Address deleted with ID: " + id);
    }

}

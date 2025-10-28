package com.example.database.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerNumber;

    private String firstName;
    private String lastName;
    private String phoneNumber;

    // 🔗 Foreign Key → Address (Billing Address)
    @ManyToOne
    @JoinColumn(name = "billing_address_id")
    private Address deliveryAddress;

    public Customer() {}



    public Customer(String firstName, String lastName, String phoneNumber, Address deliveryAddress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.deliveryAddress = deliveryAddress;
    }




    // ✅ Getters & Setters
    public Long getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(Long customerNumber) { this.customerNumber = customerNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }


    public Address getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(Address billingAddress) { this.deliveryAddress = billingAddress; }
}

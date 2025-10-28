package com.example.database.demo.config;

import com.example.database.demo.model.*;
import com.example.database.demo.repository.*;
import com.example.database.demo.service.LoginCredentialService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final LoginCredentialService loginService;
    private final StaffRepository staffRepository;
    private final DriverRepository driverRepository;
    private final AddressRepository addressRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(LoginCredentialService loginService,
                           StaffRepository staffRepository,
                           DriverRepository driverRepository,
                           AddressRepository addressRepository,
                           MenuItemRepository menuItemRepository,
                           OrderRepository orderRepository) {
        this.loginService = loginService;
        this.staffRepository = staffRepository;
        this.driverRepository = driverRepository;
        this.addressRepository = addressRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        // Register users
        if (staffRepository.count() == 0) {
            loginService.registerUser("admin01", "Password1", true);
            loginService.registerUser("john01", "Password1", false);

            LoginCredential johnLogin = loginService.getUserByUsername("john01");
            Staff john = new Staff("John", "Smith", johnLogin);
            staffRepository.save(john);

            driverRepository.save(new Driver("Alex Driver"));
            driverRepository.save(new Driver("Tom Rider"));

            Address addr = new Address("123", "A", "Sunset Tower", "Dallas", "TX", "75001", "USA");
            addressRepository.save(addr);

            menuItemRepository.save(new MenuItem("Pizza Margherita", 12.99, "Pizza", true));
            menuItemRepository.save(new MenuItem("Cheeseburger", 10.49, "Burger", true));

            Order order = new Order();
            order.setCustomerName("Mobin");
            order.setDeliveryAddress(addr);
            order.setOrderStatus("Pending");
            orderRepository.save(order);

            System.out.println("✅ Database initialized with demo data");



            System.out.println("\n--- 📋 DATABASE CONTENTS ---");
            staffRepository.findAll().forEach(s ->
                    System.out.println("👨‍🍳 STAFF: " + s.getFirstName() + " " + s.getLastName())
            );
            driverRepository.findAll().forEach(d ->
                    System.out.println("🚗 DRIVER: " + d.getDriverName())
            );
            menuItemRepository.findAll().forEach(m ->
                    System.out.println("🍔 MENU ITEM: " + m.getName() + " $" + m.getPrice())
            );
            orderRepository.findAll().forEach(o ->
                    System.out.println("🧾 ORDER: #" + o.getOrderId() + " for " + o.getCustomerName())
            );
            System.out.println("----------------------------\n");
        } else {
            System.out.println("ℹ️ Database already contains data. Skipping seeding.");
            System.out.println("\n--- 📋 DATABASE CONTENTS ---");
            staffRepository.findAll().forEach(s ->
                    System.out.println("👨‍🍳 STAFF: " + s.getFirstName() + " " + s.getLastName())
            );
            driverRepository.findAll().forEach(d ->
                    System.out.println("🚗 DRIVER: " + d.getDriverName())
            );
            menuItemRepository.findAll().forEach(m ->
                    System.out.println("🍔 MENU ITEM: " + m.getName() + " $" + m.getPrice())
            );
            orderRepository.findAll().forEach(o ->
                    System.out.println("🧾 ORDER: #" + o.getOrderId() + " for " + o.getCustomerName())
            );
            System.out.println("----------------------------\n");
        }
    }
}

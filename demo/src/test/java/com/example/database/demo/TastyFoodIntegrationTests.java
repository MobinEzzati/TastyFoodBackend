package com.example.database.demo;

import com.example.database.demo.model.*;
import com.example.database.demo.model.Order;
import com.example.database.demo.repository.*;
import com.example.database.demo.service.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TastyFoodIntegrationTests {

    @Autowired private LoginCredentialService loginService;
    @Autowired private StaffService staffService;
    @Autowired private DriverService driverService;
    @Autowired private OrderService orderService;
    @Autowired private AddressRepository addressRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private DriverRepository driverRepository;

    private Staff staff;
    private Driver driver;
    private Address address;
    private Order order;

    @BeforeEach
    void setup() {
        // 🏠 Create address
        address = new Address("123", "Unit 1", "Building A", "Dallas", "TX", "75001", "USA");
        addressRepository.save(address);

        // 👨‍💼 Create staff login & record
        loginService.registerUser("john01", "Password1", false);
        staff = staffService.createStaff("John", "Smith", "john01");

        // 🚗 Create driver
        driver = driverService.addDriver("Alex Driver");

        // 🧾 Create order using service
        order = orderService.createOrder("Mobin", address.getAddressId(), driver.getDriverId(),
                staff.getStaffId(), 5.0);
    }

    @Test
    void testSuccessfulLoginByStaff() {
        boolean result = loginService.validateUser("john01", "Password1");
        assertTrue(result);
        System.out.println("✅ Successful login by a staff member");
    }

    @Test
    void testInvalidLoginByStaff() {
        boolean result = loginService.validateUser("john01", "wrongPassword");
        assertFalse(result);
        System.out.println("❌ Invalid login by a staff member");
    }

    @Test
    void testNewOrderCreatedAndSaved() {
        assertNotNull(order.getOrderId());
        assertEquals("PENDING", order.getOrderStatus());
        System.out.println("✅ A new order is created and saved");
    }

    @Test
    void testAssignDriverToOrder() {
        order.setDriver(driver);
        order.setAssignedByStaff(staff);
        order.setAssignedAt(LocalDateTime.now());
        order.setOrderStatus("ASSIGNED");
        orderRepository.save(order);

        Optional<Order> found = orderRepository.findById(order.getOrderId());
        assertTrue(found.isPresent());
        assertEquals("ASSIGNED", found.get().getOrderStatus());
        System.out.println("✅ Existing order assigned a driver and saved");
    }

    @Test
    void testUpdateOrderDeliveryTime() {
        orderService.markOrderAsDelivered(order.getOrderId());

        Optional<Order> found = orderRepository.findById(order.getOrderId());
        assertTrue(found.isPresent());
        assertEquals("DELIVERED", found.get().getOrderStatus());
        assertNotNull(found.get().getDeliveredAt());
        System.out.println("✅ Order updated with delivery time and saved");
    }

    @Test
    void testCreateNewStaffAccount() {
        loginService.registerUser("mary01", "Password1", false);
        Staff newStaff = staffService.createStaff("Mary", "Brown", "mary01");
        assertNotNull(newStaff);
        assertTrue(staffRepository.existsById(newStaff.getStaffId()));
        System.out.println("✅ New staff member account created and saved");
    }

    @Test
    void testDeleteStaffAccount() {
        Long staffId = staff.getStaffId();
        staffService.deleteStaff(staffId);
        assertFalse(staffRepository.existsById(staffId));
        System.out.println("🗑️ Staff member account deleted");
    }

    @Test
    void testAddNewDriverRecord() {
        Driver newDriver = driverService.addDriver("Tom Driver");
        assertNotNull(newDriver.getDriverId());
        assertTrue(driverRepository.existsById(newDriver.getDriverId()));
        System.out.println("✅ New driver record added to the system");
    }

    @Test
    void testDeleteDriverRecord() {
        Long driverId = driver.getDriverId();
        driverService.deleteDriver(driverId);
        assertFalse(driverRepository.existsById(driverId));
        System.out.println("🗑️ Driver record deleted");
    }
}

package com.example.database.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staffId;

    private String firstName;
    private String lastName;

    // ✅ Status to show if the staff is active (hired) or inactive (fired)
    private boolean isActive = true;

    // ✅ FK → LoginCredential.username (One-to-One)
    @OneToOne
    @JoinColumn(name = "login_username", referencedColumnName = "username", nullable = false)
    private LoginCredential loginCredential;

    public Staff() {}

    public Staff(String firstName, String lastName, LoginCredential loginCredential) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.loginCredential = loginCredential;
        this.isActive = true;
    }

    // ✅ Getters & Setters
    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LoginCredential getLoginCredential() { return loginCredential; }
    public void setLoginCredential(LoginCredential loginCredential) { this.loginCredential = loginCredential; }
}

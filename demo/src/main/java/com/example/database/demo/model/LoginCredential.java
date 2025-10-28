package com.example.database.demo.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LoginCredential {
    @Id
    private String username;

    private String passwordHash;
    private boolean isAdmin;

    // Constructors
    public LoginCredential() {}

    public LoginCredential(String username, String passwordHash, boolean isAdmin) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.isAdmin = isAdmin;
    }

    // Getters & Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
}

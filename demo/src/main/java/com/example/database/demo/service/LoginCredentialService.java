package com.example.database.demo.service;

import  com.example.database.demo.model.LoginCredential;
import  com.example.database.demo.repository.LoginCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class LoginCredentialService {

    @Autowired
    private LoginCredentialRepository repository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void registerUser(String username, String rawPassword, boolean isAdmin) {
        String hashedPassword = passwordEncoder.encode(rawPassword);
        LoginCredential newUser = new LoginCredential(username, hashedPassword, isAdmin);
        repository.save(newUser);
        System.out.println("✅ User registered: " + username + " (Admin: " + isAdmin + ")");

    }

    public boolean validateUser(String username, String rawPassword) {
        LoginCredential user = repository.findByUsername(username);
        if (user == null) {
            System.out.println("❌ User not found: " + username);
            return false;
        }
        boolean match = passwordEncoder.matches(rawPassword, user.getPasswordHash());
        System.out.println("🔍 Login attempt for " + username + " → " + (match ? "✅ Success" : "❌ Failed"));
        return match;
    }

    public boolean isAdmin(String username) {
        LoginCredential user = repository.findByUsername(username);
        boolean admin = user != null && user.isAdmin();
        System.out.println("👑 User " + username + " is admin? " + admin);
        return admin;
    }

    public LoginCredential getUserByUsername(String username) {
        return repository.findByUsername(username);
    }
}
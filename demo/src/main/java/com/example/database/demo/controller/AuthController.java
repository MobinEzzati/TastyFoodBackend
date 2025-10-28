package com.example.database.demo.controller;


import com.example.database.demo.service.LoginCredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private LoginCredentialService loginService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String username,
                                           @RequestParam String password,
                                           @RequestParam(defaultValue = "false") boolean isAdmin) {
        loginService.registerUser(username, password, isAdmin);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username,
                                        @RequestParam String password) {
        boolean valid = loginService.validateUser(username, password);
        if (!valid) return ResponseEntity.status(401).body("❌ Invalid credentials for " + username);
        boolean admin = loginService.isAdmin(username);
        return ResponseEntity.ok("✅ Login successful for " + username + " | Admin: " + admin);
    }
}
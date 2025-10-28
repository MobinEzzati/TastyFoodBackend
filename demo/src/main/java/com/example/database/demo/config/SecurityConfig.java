package com.example.database.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for now
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Allow all routes (no auth restrictions)
                )
                .formLogin(login -> login.disable()) // Disable default login page
                .httpBasic(httpBasic -> httpBasic.disable()); // Disable HTTP basic authentication

        return http.build();
    }
}

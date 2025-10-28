package com.example.database.demo.repository;


import com.example.database.demo.model.LoginCredential ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginCredentialRepository extends JpaRepository<LoginCredential, String> {
    LoginCredential findByUsername(String username);

}

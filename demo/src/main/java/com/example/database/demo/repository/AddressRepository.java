package com.example.database.demo.repository;
import com.example.database.demo.model.LoginCredential;
import com.example.database.demo.model.Address ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {


}

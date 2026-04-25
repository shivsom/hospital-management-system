package com.hospital.repository;

import com.hospital.model.User;
import org.springframework.data.jpa.repository.JpaRepository; // JPA repository used for(findByEmail()) database operations
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
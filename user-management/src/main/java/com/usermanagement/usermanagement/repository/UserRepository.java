package com.usermanagement.usermanagement.repository;

import com.usermanagement.usermanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findUserByUid(UUID uid);
    void deleteUserByUid(UUID uid);
}

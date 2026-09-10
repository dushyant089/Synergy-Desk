package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // ==========================================
    // GET USER BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id) {

        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                    ResponseEntity.notFound().build()
                );
    }


    // ==========================================
    // UPDATE USER
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user =
                userRepository.findById(id)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Update basic information
        if (updatedUser.getName() != null &&
                !updatedUser.getName().isBlank()) {

            user.setName(
                    updatedUser.getName()
            );
        }


        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().isBlank()) {

            user.setEmail(
                    updatedUser.getEmail()
            );
        }


        // Role update
        if (updatedUser.getRole() != null &&
                !updatedUser.getRole().isBlank()) {

            String role =
                    updatedUser.getRole()
                    .toUpperCase();

            if (
                role.equals("ADMIN") ||
                role.equals("EMPLOYEE")
            ) {

                user.setRole(role);

            } else {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Invalid role. Use ADMIN or EMPLOYEE."
                        );
            }
        }


        User savedUser =
                userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }


    // ==========================================
    // DELETE USER
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        if (!userRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        userRepository.deleteById(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}

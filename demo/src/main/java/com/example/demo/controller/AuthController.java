package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        if (user.getName() == null ||
                user.getName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Name is required");
        }

        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Password is required");
        }

        if (userRepository.existsByEmail(
                user.getEmail())) {

            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        // New registrations are always EMPLOYEE
        user.setRole("EMPLOYEE");

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        // Don't send password back
        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
        @RequestParam String email,
        @RequestParam String newPassword) {

    Optional<User> existingUser =
            userRepository.findByEmail(email);

    if (existingUser.isEmpty()) {
        return ResponseEntity.badRequest()
                .body("User not found");
    }

    User user = existingUser.get();

    user.setPassword(
            passwordEncoder.encode(newPassword)
    );

    userRepository.save(user);

    return ResponseEntity.ok(
            "Password reset successfully"
    );
}

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user) {

        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Password is required");
        }

        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                );

        if (existingUser.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        User foundUser =
                existingUser.get();

        if (foundUser.getPassword() == null ||
                foundUser.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(
                        "Account password is missing. Please register again."
                    );
        }

        // Check password
        boolean passwordMatches =
                passwordEncoder.matches(
                        user.getPassword(),
                        foundUser.getPassword()
                );

        if (!passwordMatches) {

            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        String role = foundUser.getRole();

        if (role == null || role.isBlank()) {
            role = "EMPLOYEE";
        }

        // Generate JWT token
        String token =
                jwtService.generateToken(
                        foundUser.getEmail(),
                        role
                );

        // Login response
        Map<String, Object> response =
                new HashMap<>();

        response.put("token", token);
        response.put("id", foundUser.getId());
        response.put("name", foundUser.getName());
        response.put("email", foundUser.getEmail());
        response.put("role", role);

        return ResponseEntity.ok(response);
    }
}
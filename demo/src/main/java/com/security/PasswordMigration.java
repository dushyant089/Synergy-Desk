package com.example.demo.security;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordMigration {

    @Bean
    CommandLineRunner migratePasswords(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            for (User user : userRepository.findAll()) {

                String password = user.getPassword();

                if (password == null ||
                        password.isBlank()) {
                    continue;
                }

                // BCrypt password usually starts with $2a$, $2b$ or $2y$
                boolean alreadyEncrypted =
                        password.startsWith("$2a$") ||
                        password.startsWith("$2b$") ||
                        password.startsWith("$2y$");

                if (!alreadyEncrypted) {

                    user.setPassword(
                            passwordEncoder.encode(password)
                    );

                    userRepository.save(user);

                    System.out.println(
                            "Password migrated for: "
                            + user.getEmail()
                    );
                }
            }
        };
    }
}
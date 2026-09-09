package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // CSRF disable
            .csrf(csrf -> csrf.disable())

            // CORS enable
            .cors(cors -> {})

            // JWT ke liye session stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // =====================================
                // AUTH APIs - PUBLIC
                // =====================================
                .requestMatchers("/api/auth/**")
                .permitAll()

                // =====================================
                // ADMIN APIs
                // =====================================
                .requestMatchers("/api/users/**")
                .hasRole("ADMIN")

                .requestMatchers("/api/reports/**")
                .hasRole("ADMIN")

                // =====================================
                // LOGIN REQUIRED
                // =====================================
                .requestMatchers(
                    "/api/tasks/**",
                    "/api/attendance/**",
                    "/api/dashboard/**"
                )
                .authenticated()

                // =====================================
                // EVERYTHING ELSE
                // =====================================
                .anyRequest()
                .authenticated()
            )

            // JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
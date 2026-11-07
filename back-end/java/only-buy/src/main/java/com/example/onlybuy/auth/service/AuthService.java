package com.example.onlybuy.auth.service;

import com.example.onlybuy.auth.dto.LoginRequest;
import com.example.onlybuy.auth.dto.RegisterRequest;
import com.example.onlybuy.users.dto.UserResponse;
import com.example.onlybuy.users.entity.UserEntity;
import com.example.onlybuy.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserResponse login(LoginRequest request) {
        return new UserResponse();
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        UserEntity user = new UserEntity();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        UserEntity savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }
}

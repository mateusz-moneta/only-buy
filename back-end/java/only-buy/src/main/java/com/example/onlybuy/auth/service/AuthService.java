package com.example.onlybuy.auth.service;

import com.example.onlybuy.auth.dto.LoginRequest;
import com.example.onlybuy.auth.dto.RegisterRequest;
import com.example.onlybuy.exception.InvalidCredentialsException;
import com.example.onlybuy.storage.FileStorageService;
import com.example.onlybuy.users.dto.UserResponse;
import com.example.onlybuy.users.entity.UserEntity;
import com.example.onlybuy.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return new UserResponse(
            user.getEmail(),
            user.getUsername()
        );
    }

    public UserResponse register(RegisterRequest request, MultipartFile avatar) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        UserEntity user = new UserEntity();

        String avatarPath = fileStorageService.saveAvatar(avatar);

        user.setAvatar(avatarPath);
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setActive(true);

        UserEntity savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }
}

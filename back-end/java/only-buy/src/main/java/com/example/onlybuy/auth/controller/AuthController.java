package com.example.onlybuy.auth.controller;

import com.example.onlybuy.auth.dto.LoginRequest;
import com.example.onlybuy.auth.dto.RegisterRequest;
import com.example.onlybuy.auth.service.AuthService;
import com.example.onlybuy.roles.dto.RoleResponse;

import com.example.onlybuy.users.dto.UserResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/login")
    public UserResponse login(LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/register")
    public UserResponse register(RegisterRequest request) {
        return authService.register(request);
    }
}
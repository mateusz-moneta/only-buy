package com.example.onlybuy.auth.controller;

import com.example.onlybuy.auth.dto.LoginRequest;
import com.example.onlybuy.auth.dto.RegisterRequest;
import com.example.onlybuy.auth.service.AuthService;

import com.example.onlybuy.users.dto.UserResponse;

import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.*;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login successful"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Invalid email or password"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Validation error"
        )
    })
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Register successful"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Validation error"
        )
    })
    @PostMapping(
        value = "/register",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponse> register(
        @RequestPart("request") RegisterRequest request,
        @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return ResponseEntity.ok(authService.register(request, avatar));
    }
}
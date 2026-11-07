package com.example.onlybuy.auth.controller;

import com.example.onlybuy.roles.dto.RoleResponse;
import com.example.onlybuy.roles.service.RoleService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final RoleService roleService;

    @GetMapping("/login")
    public List<RoleResponse> login() {
        return roleService.getAllRoles();
    }
}
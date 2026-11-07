package com.example.onlybuy.roles.controller;

import com.example.onlybuy.roles.dto.RoleResponse;
import com.example.onlybuy.roles.service.RoleService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolesController {
    private final RoleService roleService;

    @GetMapping
    public List<RoleResponse> getRoles() {
        return roleService.getAllRoles();
    }
}
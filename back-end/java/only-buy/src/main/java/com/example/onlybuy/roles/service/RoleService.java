package com.example.onlybuy.roles.service;

import com.example.onlybuy.roles.dto.RoleResponse;
import com.example.onlybuy.roles.mapper.RoleMapper;
import com.example.onlybuy.roles.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toDto)
                .toList();
    }
}

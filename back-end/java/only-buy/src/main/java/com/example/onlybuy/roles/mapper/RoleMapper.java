package com.example.onlybuy.roles.mapper;

import com.example.onlybuy.roles.dto.RoleDto;
import com.example.onlybuy.roles.entity.Role;

import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public RoleDto toDto(Role role) {
        return new RoleDto(
                role.getId(),
                role.getName()
        );
    }
}

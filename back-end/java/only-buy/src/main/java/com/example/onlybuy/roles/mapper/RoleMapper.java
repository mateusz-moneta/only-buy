package com.example.onlybuy.roles.mapper;

import com.example.onlybuy.roles.dto.RoleResponse;
import com.example.onlybuy.roles.entity.RoleEntity;

import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public RoleResponse toDto(RoleEntity role) {
        return new RoleResponse(
                role.getId(),
                role.getName()
        );
    }
}

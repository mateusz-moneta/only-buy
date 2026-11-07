package com.example.onlybuy.users.mapper;

import com.example.onlybuy.users.dto.UserResponse;
import com.example.onlybuy.users.entity.UserEntity;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toDto(UserEntity user) {
        return new UserResponse(
                user.getEmail(),
                user.getUsername()
        );
    }
}

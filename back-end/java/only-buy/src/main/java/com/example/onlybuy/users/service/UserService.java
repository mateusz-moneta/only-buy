package com.example.onlybuy.users.service;

import com.example.onlybuy.users.dto.UserResponse;
import com.example.onlybuy.users.mapper.UserMapper;
import com.example.onlybuy.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }
}

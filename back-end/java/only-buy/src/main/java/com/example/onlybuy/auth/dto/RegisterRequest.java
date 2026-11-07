package com.example.onlybuy.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest extends LoginRequest {
    private String username;
}

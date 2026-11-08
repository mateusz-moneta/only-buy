package com.example.onlybuy.auth.dto;

import jakarta.validation.constraints.Email;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @Email(message = "Enter correct e-mail")
    private String email;

    private String password;
}

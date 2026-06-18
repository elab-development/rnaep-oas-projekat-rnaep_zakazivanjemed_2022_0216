package com.medplatform.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Email(message = "Email nije validan")
    @NotBlank(message = "Email je obavezan")
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    private String lozinka;
}
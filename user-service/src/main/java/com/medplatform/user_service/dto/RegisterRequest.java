package com.medplatform.user_service.dto;

import com.medplatform.user_service.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Ime je obavezno")
    private String ime;

    @NotBlank(message = "Prezime je obavezno")
    private String prezime;

    @Email(message = "Email nije validan")
    @NotBlank(message = "Email je obavezan")
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 karaktera")
    private String lozinka;

    private Role uloga = Role.PACIJENT;

    // Opciono - samo ako je uloga PACIJENT
    private Long maticniLekarId;

    private String telefon;
}
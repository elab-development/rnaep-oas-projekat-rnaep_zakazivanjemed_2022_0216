package com.medplatform.user_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String ime;

    @NotBlank
    private String prezime;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @NotBlank
    @Column(nullable = false)
    private String lozinka;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role uloga;

    private boolean emailVerifikovan = false;

    private String telefon;

    private String adresa;

    @ManyToOne
    @JoinColumn(name = "maticni_lekar_id")
    private Doctor maticniLekar;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
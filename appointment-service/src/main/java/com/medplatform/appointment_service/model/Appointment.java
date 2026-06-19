package com.medplatform.appointment_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long doktorId;

    @Column(nullable = false)
    private Long pacijentId;

    @Column(nullable = false)
    private LocalDate datum;

    @Column(nullable = false)
    private LocalTime vreme;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    private String napomena;

    private LocalDateTime createdAt;

    // Denormalizovani podaci za brži prikaz
    private String doktorIme;
    private String doktorPrezime;
    private String doktorSpecijalnost;
    private String pacijentIme;
    private String pacijentPrezime;
    private String pacijentEmail;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = AppointmentStatus.ZAKAZAN;
        }
    }
}
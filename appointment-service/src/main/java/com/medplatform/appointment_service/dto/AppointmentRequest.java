package com.medplatform.appointment_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long doktorId;
    private Long pacijentId;
    private LocalDate datum;
    private LocalTime vreme;
    private String napomena;

    // Denormalizovani podaci
    private String doktorIme;
    private String doktorPrezime;
    private String doktorSpecijalnost;
    private String pacijentIme;
    private String pacijentPrezime;
    private String pacijentEmail;
}
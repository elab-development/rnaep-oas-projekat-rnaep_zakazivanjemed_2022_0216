package com.medplatform.appointment_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AppointmentRequest {
    private Long doktorId;
    private Long pacijentId;
    private LocalDate datum;
    private String vreme;
    private String napomena;
    private String doktorIme;
    private String doktorPrezime;
    private String doktorSpecijalnost;
    private String pacijentIme;
    private String pacijentPrezime;
    private String pacijentEmail;
    private String pacijentTelefon;
}
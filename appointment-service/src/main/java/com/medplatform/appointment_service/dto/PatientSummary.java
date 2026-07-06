package com.medplatform.appointment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientSummary {
    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private long brojPregleda;
}
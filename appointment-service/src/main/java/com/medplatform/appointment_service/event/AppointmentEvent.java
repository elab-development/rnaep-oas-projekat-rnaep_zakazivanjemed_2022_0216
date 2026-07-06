package com.medplatform.appointment_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentEvent {

    private String eventType;          // CREATED / CANCELLED / RESCHEDULED / COMPLETED

    private Long appointmentId;
    private Long doktorId;
    private Long pacijentId;

    private String pacijentEmail;
    private String pacijentIme;
    private String pacijentPrezime;
    private String pacijentTelefon;

    private String doktorIme;
    private String doktorPrezime;
    private String doktorSpecijalnost;

    private String datum;              // ISO-8601, npr. 2026-07-10
    private String vreme;// HH:mm
    private String napomena;
}
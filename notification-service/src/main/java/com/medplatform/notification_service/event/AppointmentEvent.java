package com.medplatform.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentEvent {

    private String eventType;

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

    private String datum;
    private String vreme;
}
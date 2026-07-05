package com.medplatform.medical_records_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordCreatedEvent {

    private String recordId;
    private Long appointmentId;
    private Long pacijentId;
    private Long doktorId;

    private String pacijentEmail;
    private String pacijentIme;
    private String pacijentPrezime;
    private String pacijentTelefon;

    private String doktorIme;
    private String doktorPrezime;

    private String datumPregleda; // ISO datum
}
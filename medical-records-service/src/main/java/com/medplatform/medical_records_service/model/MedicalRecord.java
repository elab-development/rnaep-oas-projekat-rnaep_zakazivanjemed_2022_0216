package com.medplatform.medical_records_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "medical_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    private String id;

    private Long appointmentId;
    private Long pacijentId;
    private Long doktorId;

    private String doktorIme;
    private String doktorPrezime;

    private LocalDate datumPregleda;
    private String dijagnoza;
    private List<String> simptomi;
    private List<Prescription> recepti;
    private String napomene;
    private LocalDate followUpDate;

    private LocalDateTime createdAt;

    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
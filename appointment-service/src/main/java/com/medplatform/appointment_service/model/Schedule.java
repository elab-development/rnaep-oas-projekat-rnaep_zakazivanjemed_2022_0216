package com.medplatform.appointment_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "schedules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long doktorId;

    @Column(nullable = false)
    private String dan; // PONEDELJAK, UTORAK...

    @Column(nullable = false)
    private String pocetak; // "09:00"

    @Column(nullable = false)
    private String kraj; // "17:00"
}
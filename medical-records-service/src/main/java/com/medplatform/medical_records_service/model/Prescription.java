package com.medplatform.medical_records_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    private String lek;
    private String doza;
    private String trajanje;
}
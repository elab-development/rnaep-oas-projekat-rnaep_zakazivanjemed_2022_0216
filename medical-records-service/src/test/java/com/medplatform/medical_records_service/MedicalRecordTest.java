package com.medplatform.medical_records_service;

import com.medplatform.medical_records_service.model.MedicalRecord;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class MedicalRecordTest {

    @Test
    void prePersistPostavljaCreatedAt() {
        MedicalRecord r = MedicalRecord.builder().appointmentId(1L).build();
        assertNull(r.getCreatedAt());
        r.prePersist();
        assertNotNull(r.getCreatedAt());
    }
}
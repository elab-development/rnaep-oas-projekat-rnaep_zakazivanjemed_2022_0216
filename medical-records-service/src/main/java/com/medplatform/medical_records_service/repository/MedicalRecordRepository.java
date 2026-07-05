package com.medplatform.medical_records_service.repository;

import com.medplatform.medical_records_service.model.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    List<MedicalRecord> findByPacijentId(Long pacijentId);
    List<MedicalRecord> findByDoktorId(Long doktorId);
    List<MedicalRecord> findByAppointmentId(Long appointmentId);
}
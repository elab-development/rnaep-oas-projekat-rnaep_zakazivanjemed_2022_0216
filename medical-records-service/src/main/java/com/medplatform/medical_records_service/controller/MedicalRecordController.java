package com.medplatform.medical_records_service.controller;

import com.medplatform.medical_records_service.model.MedicalRecord;
import com.medplatform.medical_records_service.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;

    @PostMapping
    public ResponseEntity<MedicalRecord> create(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(service.create(record));
    }

    @GetMapping("/my/{pacijentId}")
    public ResponseEntity<List<MedicalRecord>> getMyRecords(@PathVariable Long pacijentId) {
        return ResponseEntity.ok(service.getByPacijentId(pacijentId));
    }

    @GetMapping("/doctor/{doktorId}")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(@PathVariable Long doktorId) {
        return ResponseEntity.ok(service.getByDoktorId(doktorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> update(@PathVariable String id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(service.update(id, record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
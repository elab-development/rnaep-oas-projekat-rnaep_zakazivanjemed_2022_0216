package com.medplatform.medical_records_service.controller;

import com.medplatform.medical_records_service.model.MedicalRecord;
import com.medplatform.medical_records_service.security.SecurityUtils;
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

    // Samo doktor sme ručno da kreira karton.
    @PostMapping
    public ResponseEntity<MedicalRecord> create(@RequestBody MedicalRecord record) {
        if (!SecurityUtils.hasRole("DOKTOR")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.create(record));
    }

    // IDOR: pacijent iz tokena, ne iz URL-a.
    @GetMapping("/my")
    public ResponseEntity<List<MedicalRecord>> getMyRecords() {
        return ResponseEntity.ok(service.getByPacijentId(SecurityUtils.currentUserId()));
    }

    @GetMapping("/doctor/{doktorId}")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(@PathVariable Long doktorId) {
        // Doktor sme da vidi samo svoje kartone.
        if (!SecurityUtils.hasRole("DOKTOR") || !SecurityUtils.currentUserId().equals(doktorId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.getByDoktorId(doktorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getById(@PathVariable String id) {
        MedicalRecord record = service.getById(id);
        if (!smePristupiti(record)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(record);
    }

    // Samo doktor koji je vlasnik kartona sme da menja.
    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> update(@PathVariable String id, @RequestBody MedicalRecord record) {
        MedicalRecord postojeci = service.getById(id);
        if (!SecurityUtils.hasRole("DOKTOR") || !SecurityUtils.currentUserId().equals(postojeci.getDoktorId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(service.update(id, record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        MedicalRecord postojeci = service.getById(id);
        if (!SecurityUtils.hasRole("DOKTOR") || !SecurityUtils.currentUserId().equals(postojeci.getDoktorId())) {
            return ResponseEntity.status(403).build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Karton sme da vidi: pacijent-vlasnik ili doktor-vlasnik.
    private boolean smePristupiti(MedicalRecord record) {
        Long userId = SecurityUtils.currentUserId();
        if (userId == null) return false;
        boolean pacijentVlasnik = userId.equals(record.getPacijentId());
        boolean doktorVlasnik = SecurityUtils.hasRole("DOKTOR") && userId.equals(record.getDoktorId());
        return pacijentVlasnik || doktorVlasnik;
    }
}
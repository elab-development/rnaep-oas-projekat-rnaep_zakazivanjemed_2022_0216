package com.medplatform.medical_records_service.service;

import com.medplatform.medical_records_service.model.MedicalRecord;
import com.medplatform.medical_records_service.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.medplatform.medical_records_service.util.InputSanitizer;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository repository;

    public MedicalRecord create(MedicalRecord record) {
        record.setDijagnoza(InputSanitizer.clean(record.getDijagnoza()));
        record.setNapomene(InputSanitizer.clean(record.getNapomene()));
        record.prePersist();
        return repository.save(record);
    }


    public List<MedicalRecord> getByPacijentId(Long pacijentId) {
        return repository.findByPacijentId(pacijentId).stream()
                .sorted(Comparator.comparing(MedicalRecord::getDatumPregleda).reversed())
                .toList();
    }

    public List<MedicalRecord> getByDoktorId(Long doktorId) {
        return repository.findByDoktorId(doktorId).stream()
                .sorted(Comparator.comparing(MedicalRecord::getDatumPregleda).reversed())
                .toList();
    }

    public MedicalRecord getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicinski zapis nije pronađen"));
    }

    public MedicalRecord update(String id, MedicalRecord updated) {
        MedicalRecord record = getById(id);
        if (updated.getDijagnoza() != null) record.setDijagnoza(InputSanitizer.clean(updated.getDijagnoza()));
        if (updated.getSimptomi() != null) record.setSimptomi(updated.getSimptomi());
        if (updated.getRecepti() != null) record.setRecepti(updated.getRecepti());
        if (updated.getNapomene() != null) record.setNapomene(InputSanitizer.clean(updated.getNapomene()));
        if (updated.getFollowUpDate() != null) record.setFollowUpDate(updated.getFollowUpDate());
        return repository.save(record);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }
}
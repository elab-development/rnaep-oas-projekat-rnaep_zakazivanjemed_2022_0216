package com.medplatform.medical_records_service.listener;

import com.medplatform.medical_records_service.config.KafkaTopics;
import com.medplatform.medical_records_service.event.AppointmentEvent;
import com.medplatform.medical_records_service.event.MedicalRecordCreatedEvent;
import com.medplatform.medical_records_service.messaging.MedicalRecordEventPublisher;
import com.medplatform.medical_records_service.model.MedicalRecord;
import com.medplatform.medical_records_service.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentCompletedListener {

    private final MedicalRecordRepository repository;
    private final MedicalRecordEventPublisher eventPublisher;

    @KafkaListener(
            topics = KafkaTopics.APPOINTMENT_COMPLETED,
            containerFactory = "appointmentKafkaListenerContainerFactory")
    public void handleAppointmentCompleted(AppointmentEvent e) {
        log.info("Primljen appointment-completed (appointmentId={})", e.getAppointmentId());

        MedicalRecord record;

        List<MedicalRecord> postojeci = e.getAppointmentId() != null
                ? repository.findByAppointmentId(e.getAppointmentId())
                : List.of();

        if (!postojeci.isEmpty()) {
            // Karton već postoji — ne pravi nov, ali svejedno obavesti pacijenta.
            record = postojeci.get(0);
            log.info("Karton za appointmentId={} već postoji (recordId={}), šaljem obaveštenje.",
                    e.getAppointmentId(), record.getId());
        } else {
            // Napravi NACRT kartona koji lekar kasnije popunjava.
            record = MedicalRecord.builder()
                    .appointmentId(e.getAppointmentId())
                    .pacijentId(e.getPacijentId())
                    .doktorId(e.getDoktorId())
                    .doktorIme(e.getDoktorIme())
                    .doktorPrezime(e.getDoktorPrezime())
                    .datumPregleda(parseDatum(e.getDatum()))
                    .dijagnoza(null)
                    .simptomi(List.of())
                    .recepti(List.of())
                    .napomene("Automatski nacrt kartona nakon završenog pregleda.")
                    .build();

            record.prePersist();
            record = repository.save(record);
            log.info("Kreiran nacrt kartona (recordId={})", record.getId());
        }

        // Publikuj događaj dalje u lanac (uvek).
        MedicalRecordCreatedEvent created = MedicalRecordCreatedEvent.builder()
                .recordId(record.getId())
                .appointmentId(e.getAppointmentId())
                .pacijentId(e.getPacijentId())
                .doktorId(e.getDoktorId())
                .pacijentEmail(e.getPacijentEmail())
                .pacijentIme(e.getPacijentIme())
                .pacijentPrezime(e.getPacijentPrezime())
                .pacijentTelefon(e.getPacijentTelefon())
                .doktorIme(e.getDoktorIme())
                .doktorPrezime(e.getDoktorPrezime())
                .datumPregleda(e.getDatum())
                .build();

        eventPublisher.publishCreated(created);
    }

    private LocalDate parseDatum(String datum) {
        try {
            return datum != null ? LocalDate.parse(datum) : null;
        } catch (Exception ex) {
            log.warn("Ne mogu da parsiram datum '{}'", datum);
            return null;
        }
    }
}
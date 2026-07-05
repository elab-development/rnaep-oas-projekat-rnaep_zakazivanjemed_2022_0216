package com.medplatform.medical_records_service.messaging;

import com.medplatform.medical_records_service.config.KafkaTopics;
import com.medplatform.medical_records_service.event.MedicalRecordCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MedicalRecordEventPublisher {

    private final KafkaTemplate<String, MedicalRecordCreatedEvent> kafkaTemplate;

    public void publishCreated(MedicalRecordCreatedEvent event) {
        String key = event.getPacijentId() != null ? event.getPacijentId().toString() : null;
        kafkaTemplate.send(KafkaTopics.MEDICAL_RECORD_CREATED, key, event);
        log.info("Objavljen medical-record-created (recordId={}, appointmentId={})",
                event.getRecordId(), event.getAppointmentId());
    }
}
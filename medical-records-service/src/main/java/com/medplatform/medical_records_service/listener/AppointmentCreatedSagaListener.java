package com.medplatform.medical_records_service.listener;

import com.medplatform.medical_records_service.config.KafkaTopics;
import com.medplatform.medical_records_service.event.AppointmentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentCreatedSagaListener {

    private final KafkaTemplate<String, AppointmentEvent> appointmentKafkaTemplate;

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_CREATED,
            groupId = "medical-records-saga",
            containerFactory = "appointmentKafkaListenerContainerFactory")
    public void handleCreated(AppointmentEvent e) {
        log.info("SAGA korak 2: obrada appointment-created (id={})", e.getAppointmentId());
        try {
            if (e.getNapomena() != null && e.getNapomena().toUpperCase().contains("FAIL")) {
                throw new RuntimeException("Simulirana greska u kreiranju preliminarnog zapisa");
            }
            log.info("SAGA korak 2 uspesan za id={}", e.getAppointmentId());
        } catch (Exception ex) {
            log.warn("SAGA korak 2 NEUSPESAN za id={} -> objavljujem appointment-failed", e.getAppointmentId());
            appointmentKafkaTemplate.send(KafkaTopics.APPOINTMENT_FAILED, e);
        }
    }
}

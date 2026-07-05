package com.medplatform.appointment_service.messaging;

import com.medplatform.appointment_service.event.AppointmentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentEventPublisher {

    private final KafkaTemplate<String, AppointmentEvent> kafkaTemplate;

    public void publish(String topic, AppointmentEvent event) {
        String key = event.getPacijentId() != null ? event.getPacijentId().toString() : null;
        kafkaTemplate.send(topic, key, event);
        log.info("Objavljen dogadjaj [{}] na topic '{}' (appointmentId={})",
                event.getEventType(), topic, event.getAppointmentId());
    }
}
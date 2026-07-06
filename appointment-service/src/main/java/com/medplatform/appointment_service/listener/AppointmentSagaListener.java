package com.medplatform.appointment_service.listener;

import com.medplatform.appointment_service.config.KafkaTopics;
import com.medplatform.appointment_service.event.AppointmentEvent;
import com.medplatform.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentSagaListener {

    private final AppointmentService appointmentService;

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_FAILED,
            containerFactory = "appointmentKafkaListenerContainerFactory")
    public void handleFailed(AppointmentEvent e) {
        log.warn("SAGA kompenzacija: appointment-failed za appointmentId={}", e.getAppointmentId());
        appointmentService.compensate(e.getAppointmentId());
    }
}
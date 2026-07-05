package com.medplatform.appointment_service;

import com.medplatform.appointment_service.event.AppointmentEvent;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppointmentEventTest {

    @Test
    void builderPostavljaPolja() {
        AppointmentEvent e = AppointmentEvent.builder()
                .eventType("CREATED")
                .appointmentId(1L)
                .pacijentEmail("test@example.com")
                .build();

        assertEquals("CREATED", e.getEventType());
        assertEquals(1L, e.getAppointmentId());
        assertEquals("test@example.com", e.getPacijentEmail());
    }
}
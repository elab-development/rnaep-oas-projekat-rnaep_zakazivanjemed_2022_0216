package com.medplatform.notification_service;

import com.medplatform.notification_service.event.AppointmentEvent;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppointmentEventTest {

    @Test
    void builderPostavljaPolja() {
        AppointmentEvent e = AppointmentEvent.builder()
                .eventType("CREATED")
                .pacijentIme("Ana")
                .build();

        assertEquals("CREATED", e.getEventType());
        assertEquals("Ana", e.getPacijentIme());
    }
}
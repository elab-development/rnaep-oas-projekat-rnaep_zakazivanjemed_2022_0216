package com.medplatform.notification_service.scheduler;

import com.medplatform.notification_service.config.KafkaTopics;
import com.medplatform.notification_service.event.AppointmentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final KafkaTemplate<String, AppointmentEvent> kafkaTemplate;
    private final RestTemplate restTemplate;

    // Pokreće se svaki dan u 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void sendDailyReminders() {
        LocalDate sutra = LocalDate.now().plusDays(1);
        log.info("Slanje podsetnika za termine od {}", sutra);

        try {
            String url = "http://localhost:8082/api/appointments/date/" + sutra;
            List<Map> appointments = restTemplate.getForObject(url, List.class);

            if (appointments != null) {
                for (Map appointment : appointments) {
                    AppointmentEvent event = AppointmentEvent.builder()
                            .eventType("REMINDER")
                            .pacijentEmail(asString(appointment.get("pacijentEmail")))
                            .pacijentIme(asString(appointment.get("pacijentIme")))
                            .pacijentTelefon(asString(appointment.get("pacijentTelefon")))
                            .doktorIme(asString(appointment.get("doktorIme")))
                            .doktorPrezime(asString(appointment.get("doktorPrezime")))
                            .datum(asString(appointment.get("datum")))
                            .vreme(asString(appointment.get("vreme")))
                            .build();

                    kafkaTemplate.send(KafkaTopics.APPOINTMENT_REMINDER,
                            event.getPacijentEmail(), event);
                }
                log.info("Poslato {} podsetnika", appointments.size());
            }
        } catch (Exception e) {
            log.error("Greška pri slanju podsetnika: {}", e.getMessage());
        }
    }

    private String asString(Object o) {
        return o != null ? o.toString() : null;
    }
}
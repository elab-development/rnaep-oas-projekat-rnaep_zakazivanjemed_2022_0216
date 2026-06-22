package com.medplatform.notification_service.scheduler;

import com.medplatform.notification_service.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
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

    private final RabbitTemplate rabbitTemplate;
    private final RestTemplate restTemplate;

    // Pokreće se svaki dan u 08:00
    @Scheduled(cron = "0 0 8 * * *")
    public void sendDailyReminders() {
        LocalDate sutra = LocalDate.now().plusDays(1);
        log.info("Slanje podsetnika za termine od {}", sutra);

        try {
            // Dohvati termine za sutra iz Appointment Service-a
            String url = "http://localhost:8082/api/appointments/date/" + sutra;
            List<Map> appointments = restTemplate.getForObject(url, List.class);

            if (appointments != null) {
                for (Map appointment : appointments) {
                    String message = String.format("%s|%s|%s|%s|%s|%s",
                            appointment.get("pacijentEmail"),
                            appointment.get("pacijentIme"),
                            appointment.get("doktorIme"),
                            appointment.get("doktorPrezime"),
                            appointment.get("datum"),
                            appointment.get("vreme")
                    );
                    rabbitTemplate.convertAndSend(
                            RabbitMQConfig.EXCHANGE,
                            RabbitMQConfig.REMINDER_KEY,
                            message
                    );
                }
                log.info("Poslato {} podsetnika", appointments.size());
            }
        } catch (Exception e) {
            log.error("Greška pri slanju podsetnika: {}", e.getMessage());
        }
    }
}
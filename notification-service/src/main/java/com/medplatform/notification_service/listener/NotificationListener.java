package com.medplatform.notification_service.listener;

import com.medplatform.notification_service.config.RabbitMQConfig;
import com.medplatform.notification_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;

    // Format poruke: email|imePacijenta|imeDoktora|prezimeDoktora|datum|vreme
    @RabbitListener(queues = RabbitMQConfig.APPOINTMENT_QUEUE)
    public void handleBooking(String message) {
        log.info("Primljena poruka za zakazivanje: {}", message);
        try {
            String[] parts = message.split("\\|");
            if (parts.length >= 6) {
                emailService.sendBookingConfirmation(
                        parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
                );
            }
        } catch (Exception e) {
            log.error("Greška pri obradi poruke za zakazivanje: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.CANCEL_QUEUE)
    public void handleCancellation(String message) {
        log.info("Primljena poruka za otkazivanje: {}", message);
        try {
            String[] parts = message.split("\\|");
            if (parts.length >= 6) {
                emailService.sendCancellationNotification(
                        parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
                );
            }
        } catch (Exception e) {
            log.error("Greška pri obradi poruke za otkazivanje: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.RESCHEDULE_QUEUE)
    public void handleReschedule(String message) {
        log.info("Primljena poruka za izmenu: {}", message);
        try {
            String[] parts = message.split("\\|");
            if (parts.length >= 6) {
                emailService.sendRescheduleConfirmation(
                        parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
                );
            }
        } catch (Exception e) {
            log.error("Greška pri obradi poruke za izmenu: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.REMINDER_QUEUE)
    public void handleReminder(String message) {
        log.info("Primljena poruka za podsetnik: {}", message);
        try {
            String[] parts = message.split("\\|");
            if (parts.length >= 6) {
                emailService.sendReminderEmail(
                        parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]
                );
            }
        } catch (Exception e) {
            log.error("Greška pri obradi poruke za podsetnik: {}", e.getMessage());
        }
    }
}
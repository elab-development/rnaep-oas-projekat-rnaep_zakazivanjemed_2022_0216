package com.medplatform.notification_service.listener;

import com.medplatform.notification_service.config.KafkaTopics;
import com.medplatform.notification_service.event.AppointmentEvent;
import com.medplatform.notification_service.service.EmailService;
import com.medplatform.notification_service.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.medplatform.notification_service.event.MedicalRecordCreatedEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final EmailService emailService;
    private final SmsService smsService;

    private static final String FACTORY = "appointmentKafkaListenerContainerFactory";

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_CREATED, containerFactory = FACTORY)
    public void handleBooking(AppointmentEvent e) {
        log.info("Primljen appointment-created za {}", e.getPacijentEmail());
        emailService.sendBookingConfirmation(
                e.getPacijentEmail(), e.getPacijentIme(),
                e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        if (hasPhone(e)) {
            smsService.sendBookingConfirmation(
                    e.getPacijentTelefon(), e.getPacijentIme(),
                    e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        }
    }

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_CANCELLED, containerFactory = FACTORY)
    public void handleCancellation(AppointmentEvent e) {
        log.info("Primljen appointment-cancelled za {}", e.getPacijentEmail());
        emailService.sendCancellationNotification(
                e.getPacijentEmail(), e.getPacijentIme(),
                e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        if (hasPhone(e)) {
            smsService.sendCancellationNotification(
                    e.getPacijentTelefon(), e.getPacijentIme(),
                    e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        }
    }

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_RESCHEDULED, containerFactory = FACTORY)
    public void handleReschedule(AppointmentEvent e) {
        log.info("Primljen appointment-rescheduled za {}", e.getPacijentEmail());
        emailService.sendRescheduleConfirmation(
                e.getPacijentEmail(), e.getPacijentIme(),
                e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        if (hasPhone(e)) {
            smsService.sendRescheduleConfirmation(
                    e.getPacijentTelefon(), e.getPacijentIme(),
                    e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        }
    }

    @KafkaListener(topics = KafkaTopics.APPOINTMENT_REMINDER, containerFactory = FACTORY)
    public void handleReminder(AppointmentEvent e) {
        log.info("Primljen appointment-reminder za {}", e.getPacijentEmail());
        emailService.sendReminderEmail(
                e.getPacijentEmail(), e.getPacijentIme(),
                e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        if (hasPhone(e)) {
            smsService.sendReminderSms(
                    e.getPacijentTelefon(), e.getPacijentIme(),
                    e.getDoktorIme(), e.getDoktorPrezime(), e.getDatum(), e.getVreme());
        }
    }
    @KafkaListener(topics = KafkaTopics.MEDICAL_RECORD_CREATED,
            containerFactory = "medicalRecordKafkaListenerContainerFactory")
    public void handleMedicalRecordCreated(MedicalRecordCreatedEvent e) {
        log.info("Primljen medical-record-created za {}", e.getPacijentEmail());
        String datum = e.getDatumPregleda();
        emailService.sendEmail(
                e.getPacijentEmail(),
                "Vaš nalaz je spreman - MedConnect",
                String.format("""
                        Poštovani/a %s,

                        Vaš medicinski nalaz sa pregleda kod Dr. %s %s (%s) je kreiran
                        i biće dostupan u Vašem MedConnect nalogu.

                        Srdačan pozdrav,
                        MedConnect
                        """, e.getPacijentIme(), e.getDoktorIme(), e.getDoktorPrezime(), datum));
    }

    private boolean hasPhone(AppointmentEvent e) {
        return e.getPacijentTelefon() != null && !e.getPacijentTelefon().isBlank();
    }
}
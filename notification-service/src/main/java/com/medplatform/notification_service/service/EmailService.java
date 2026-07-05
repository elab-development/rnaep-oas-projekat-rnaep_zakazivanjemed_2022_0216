package com.medplatform.notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${notification.email.from}")
    private String from;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email poslat na: {}", to);
        } catch (Exception e) {
            log.error("Greška pri slanju emaila na {}: {}", to, e.getMessage());
        }
    }

    public void sendBookingConfirmation(String to, String imePacijenta,
                                        String imeDoktora, String prezimeDoktora,
                                        String datum, String vreme) {
        String subject = "Potvrda zakazanog termina - MedConnect";
        String body = String.format("""
                Poštovani/a %s,
                
                Vaš termin je uspešno zakazan.
                
                Detalji termina:
                  Lekar: Dr. %s %s
                  Datum: %s
                  Vreme: %s
                
                Molimo Vas da budete prisutni 10 minuta pre zakazanog vremena.
                
                Srdačan pozdrav,
                MedConnect
                """, imePacijenta, imeDoktora, prezimeDoktora, datum, vreme);
        sendEmail(to, subject, body);
    }

    public void sendCancellationNotification(String to, String imePacijenta,
                                             String imeDoktora, String prezimeDoktora,
                                             String datum, String vreme) {
        String subject = "Otkazivanje termina - MedConnect";
        String body = String.format("""
                Poštovani/a %s,
                
                Obaveštavamo Vas da je Vaš termin otkazan.
                
                Detalji otkazanog termina:
                  Lekar: Dr. %s %s
                  Datum: %s
                  Vreme: %s
                
                Možete zakazati novi termin putem MedConnect.
                
                Srdačan pozdrav,
                MedConnect
                """, imePacijenta, imeDoktora, prezimeDoktora, datum, vreme);
        sendEmail(to, subject, body);
    }

    public void sendRescheduleConfirmation(String to, String imePacijenta,
                                           String imeDoktora, String prezimeDoktora,
                                           String datum, String vreme) {
        String subject = "Potvrda izmene termina - MedConnect";
        String body = String.format("""
                Poštovani/a %s,
                
                Vaš termin je uspešno izmenjen.
                
                Novi detalji termina:
                  Lekar: Dr. %s %s
                  Datum: %s
                  Vreme: %s
                
                Molimo Vas da budete prisutni 10 minuta pre zakazanog vremena.
                
                Srdačan pozdrav,
                MedConnect
                """, imePacijenta, imeDoktora, prezimeDoktora, datum, vreme);
        sendEmail(to, subject, body);
    }

    public void sendReminderEmail(String to, String imePacijenta,
                                  String imeDoktora, String prezimeDoktora,
                                  String datum, String vreme) {
        String subject = "Podsetnik za termin sutra - MedConnect";
        String body = String.format("""
                Poštovani/a %s,
                
                Podsetnik: Sutra imate zakazan termin.
                
                Detalji termina:
                  Lekar: Dr. %s %s
                  Datum: %s
                  Vreme: %s
                
                Molimo Vas da budete prisutni 10 minuta pre zakazanog vremena.
                
                Srdačan pozdrav,
                MedConnect
                """, imePacijenta, imeDoktora, prezimeDoktora, datum, vreme);
        sendEmail(to, subject, body);
    }
}
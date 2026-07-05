package com.medplatform.notification_service.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.phone-number}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
        log.info("Twilio inicijalizovan");
    }

    public void sendSms(String to, String body) {
        try {
            // Twilio zahteva međunarodni format: +381611234567
            String formattedTo = to.startsWith("+") ? to : "+381" + to.replaceFirst("^0", "");

            Message message = Message.creator(
                    new PhoneNumber(formattedTo),
                    new PhoneNumber(fromNumber),
                    body
            ).create();

            log.info("SMS poslat na {}: SID={}", formattedTo, message.getSid());
        } catch (Exception e) {
            log.error("Greška pri slanju SMS-a na {}: {}", to, e.getMessage());
        }
    }

    public void sendBookingConfirmation(String to, String imePacijenta,
                                        String imeDoktora, String prezimeDoktora,
                                        String datum, String vreme) {
        String body = String.format(
                "MedConnect: Vaš termin je zakazan. Dr. %s %s, %s u %s. Hvala!",
                imeDoktora, prezimeDoktora, datum, vreme
        );
        sendSms(to, body);
    }

    public void sendCancellationNotification(String to, String imePacijenta,
                                             String imeDoktora, String prezimeDoktora,
                                             String datum, String vreme) {
        String body = String.format(
                "MedConnect: Vaš termin kod Dr. %s %s za %s u %s je otkazan.",
                imeDoktora, prezimeDoktora, datum, vreme
        );
        sendSms(to, body);
    }

    public void sendRescheduleConfirmation(String to, String imePacijenta,
                                           String imeDoktora, String prezimeDoktora,
                                           String datum, String vreme) {
        String body = String.format(
                "MedConnect: Vaš termin je izmenjen. Dr. %s %s, novi termin: %s u %s.",
                imeDoktora, prezimeDoktora, datum, vreme
        );
        sendSms(to, body);
    }

    public void sendReminderSms(String to, String imePacijenta,
                                String imeDoktora, String prezimeDoktora,
                                String datum, String vreme) {
        String body = String.format(
                "MedConnect: Podsetnik! Sutra imate termin kod Dr. %s %s u %s.",
                imeDoktora, prezimeDoktora, vreme
        );
        sendSms(to, body);
    }
}
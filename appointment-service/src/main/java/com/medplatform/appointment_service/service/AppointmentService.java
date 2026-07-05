package com.medplatform.appointment_service.service;

import com.medplatform.appointment_service.config.KafkaTopics;
import com.medplatform.appointment_service.dto.AppointmentRequest;
import com.medplatform.appointment_service.event.AppointmentEvent;
import com.medplatform.appointment_service.messaging.AppointmentEventPublisher;
import com.medplatform.appointment_service.model.Appointment;
import com.medplatform.appointment_service.model.AppointmentStatus;
import com.medplatform.appointment_service.model.Schedule;
import com.medplatform.appointment_service.repository.AppointmentRepository;
import com.medplatform.appointment_service.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final AppointmentEventPublisher eventPublisher;

    public Appointment book(AppointmentRequest request) {
        if (appointmentRepository.existsByDoktorIdAndDatumAndVreme(
                request.getDoktorId(), request.getDatum(), LocalTime.parse(request.getVreme()))) {
            throw new RuntimeException("Termin je već zauzet");
        }

        Appointment appointment = Appointment.builder()
                .doktorId(request.getDoktorId())
                .pacijentId(request.getPacijentId())
                .datum(request.getDatum())
                .vreme(LocalTime.parse(request.getVreme()))
                .napomena(request.getNapomena())
                .status(AppointmentStatus.ZAKAZAN)
                .doktorIme(request.getDoktorIme())
                .doktorPrezime(request.getDoktorPrezime())
                .doktorSpecijalnost(request.getDoktorSpecijalnost())
                .pacijentIme(request.getPacijentIme())
                .pacijentPrezime(request.getPacijentPrezime())
                .pacijentEmail(request.getPacijentEmail())
                .build();

        appointment = appointmentRepository.save(appointment);

        eventPublisher.publish(KafkaTopics.APPOINTMENT_CREATED, toEvent(appointment, "CREATED"));

        return appointment;
    }

    public List<Appointment> getMyAppointments(Long pacijentId) {
        return appointmentRepository.findByPacijentId(pacijentId);
    }

    public List<Long> getPatientIdsByDoktor(Long doktorId) {
        return appointmentRepository.findByDoktorId(doktorId)
                .stream()
                .map(Appointment::getPacijentId)
                .distinct()
                .toList();
    }

    public List<Appointment> getAppointmentsByDoktorAndPacijent(Long doktorId, Long pacijentId) {
        return appointmentRepository.findByDoktorId(doktorId)
                .stream()
                .filter(a -> a.getPacijentId().equals(pacijentId))
                .toList();
    }

    public List<Appointment> getDoctorAppointments(Long doktorId, LocalDate datum) {
        if (datum != null) {
            return appointmentRepository.findByDoktorIdAndDatum(doktorId, datum);
        }
        return appointmentRepository.findByDoktorId(doktorId);
    }

    public Appointment cancel(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
        appointment.setStatus(AppointmentStatus.OTKAZAN);
        appointment = appointmentRepository.save(appointment);

        eventPublisher.publish(KafkaTopics.APPOINTMENT_CANCELLED, toEvent(appointment, "CANCELLED"));

        return appointment;
    }

    public Appointment complete(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
        appointment.setStatus(AppointmentStatus.ZAVRSEN);
        appointment = appointmentRepository.save(appointment);

        // Novi Kafka lanac (Faza 2): Medical Records sluša ovaj topic.
        eventPublisher.publish(KafkaTopics.APPOINTMENT_COMPLETED, toEvent(appointment, "COMPLETED"));

        return appointment;
    }

    public Appointment reschedule(Long id, LocalDate noviDatum, String novoVreme) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));

        if (appointment.getStatus() != AppointmentStatus.ZAKAZAN) {
            throw new RuntimeException("Može se izmeniti samo termin sa statusom ZAKAZAN");
        }

        LocalTime novoVremeParsed = LocalTime.parse(novoVreme);

        boolean zauzet = appointmentRepository.existsByDoktorIdAndDatumAndVreme(
                appointment.getDoktorId(), noviDatum, novoVremeParsed);
        if (zauzet) {
            throw new RuntimeException("Izabrani termin više nije dostupan");
        }

        appointment.setDatum(noviDatum);
        appointment.setVreme(novoVremeParsed);
        appointment = appointmentRepository.save(appointment);

        eventPublisher.publish(KafkaTopics.APPOINTMENT_RESCHEDULED, toEvent(appointment, "RESCHEDULED"));

        return appointment;
    }

    // ── Slobodni termini ──────────────────────────────────

    public List<String> getAvailableSlots(Long doktorId, LocalDate datum) {
        String dayName = getDayName(datum.getDayOfWeek().name());
        List<Schedule> schedules = scheduleRepository.findByDoktorId(doktorId)
                .stream()
                .filter(s -> s.getDan().equals(dayName))
                .toList();

        if (schedules.isEmpty()) return List.of();

        Schedule schedule = schedules.get(0);
        List<String> zauzetiTermini = appointmentRepository
                .findByDoktorIdAndDatum(doktorId, datum)
                .stream()
                .map(a -> a.getVreme().toString())
                .toList();

        List<String> slobodniTermini = new ArrayList<>();
        LocalTime current = LocalTime.parse(schedule.getPocetak());
        LocalTime end = LocalTime.parse(schedule.getKraj());

        while (current.isBefore(end)) {
            String slot = current.toString();
            if (!zauzetiTermini.contains(slot)) {
                slobodniTermini.add(slot);
            }
            current = current.plusMinutes(30);
        }

        return slobodniTermini;
    }

    // ── Schedule ──────────────────────────────────────────

    public Schedule addSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getMySchedule(Long doktorId) {
        return scheduleRepository.findByDoktorId(doktorId);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    // ── Pomoćne metode ────────────────────────────────────

    private AppointmentEvent toEvent(Appointment a, String eventType) {
        return AppointmentEvent.builder()
                .eventType(eventType)
                .appointmentId(a.getId())
                .doktorId(a.getDoktorId())
                .pacijentId(a.getPacijentId())
                .pacijentEmail(a.getPacijentEmail())
                .pacijentIme(a.getPacijentIme())
                .pacijentPrezime(a.getPacijentPrezime())
                .pacijentTelefon(a.getPacijentTelefon())
                .doktorIme(a.getDoktorIme())
                .doktorPrezime(a.getDoktorPrezime())
                .doktorSpecijalnost(a.getDoktorSpecijalnost())
                .datum(a.getDatum() != null ? a.getDatum().toString() : null)
                .vreme(a.getVreme() != null ? a.getVreme().toString() : null)
                .build();
    }

    private String getDayName(String englishDay) {
        return switch (englishDay) {
            case "MONDAY" -> "PONEDELJAK";
            case "TUESDAY" -> "UTORAK";
            case "WEDNESDAY" -> "SREDA";
            case "THURSDAY" -> "CETVRTAK";
            case "FRIDAY" -> "PETAK";
            case "SATURDAY" -> "SUBOTA";
            case "SUNDAY" -> "NEDELJA";
            default -> englishDay;
        };
    }
}
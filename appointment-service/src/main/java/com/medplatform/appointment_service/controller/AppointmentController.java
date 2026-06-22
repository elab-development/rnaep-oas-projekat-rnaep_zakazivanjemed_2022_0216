package com.medplatform.appointment_service.controller;

import com.medplatform.appointment_service.dto.AppointmentRequest;
import com.medplatform.appointment_service.model.Appointment;
import com.medplatform.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> book(@RequestBody AppointmentRequest request) {
        try {
            return ResponseEntity.ok(appointmentService.book(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my/{pacijentId}")
    public ResponseEntity<List<Appointment>> getMyAppointments(@PathVariable Long pacijentId) {
        return ResponseEntity.ok(appointmentService.getMyAppointments(pacijentId));
    }

    @GetMapping("/doctor/{doktorId}/patients")
    public ResponseEntity<List<Long>> getPatientsByDoktor(@PathVariable Long doktorId) {
        return ResponseEntity.ok(appointmentService.getPatientIdsByDoktor(doktorId));
    }

    @GetMapping("/doctor/{doktorId}/patients/{pacijentId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoktorAndPacijent(
            @PathVariable Long doktorId,
            @PathVariable Long pacijentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoktorAndPacijent(doktorId, pacijentId));
    }

    @GetMapping("/doctor/{doktorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(
            @PathVariable Long doktorId,
            @RequestParam(required = false) LocalDate datum) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doktorId, datum));
    }

    @GetMapping("/slots/{doktorId}")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long doktorId,
            @RequestParam LocalDate datum) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doktorId, datum));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(appointmentService.cancel(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(appointmentService.complete(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> reschedule(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            LocalDate noviDatum = LocalDate.parse(body.get("datum"));
            String novoVreme = body.get("vreme");
            return ResponseEntity.ok(appointmentService.reschedule(id, noviDatum, novoVreme));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
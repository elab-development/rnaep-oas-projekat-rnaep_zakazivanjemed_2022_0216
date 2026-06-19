package com.medplatform.appointment_service.controller;

import com.medplatform.appointment_service.dto.AppointmentRequest;
import com.medplatform.appointment_service.model.Appointment;
import com.medplatform.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> book(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.book(request));
    }

    @GetMapping("/my/{pacijentId}")
    public ResponseEntity<List<Appointment>> getMyAppointments(@PathVariable Long pacijentId) {
        return ResponseEntity.ok(appointmentService.getMyAppointments(pacijentId));
    }

    @GetMapping("/doctor/{doktorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(
            @PathVariable Long doktorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doktorId, datum));
    }

    @GetMapping("/slots/{doktorId}")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long doktorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doktorId, datum));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancel(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> complete(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.complete(id));
    }
}
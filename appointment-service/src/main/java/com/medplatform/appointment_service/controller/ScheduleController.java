package com.medplatform.appointment_service.controller;

import com.medplatform.appointment_service.model.Schedule;
import com.medplatform.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final AppointmentService appointmentService;

    @GetMapping("/my/{doktorId}")
    public ResponseEntity<List<Schedule>> getMySchedule(@PathVariable Long doktorId) {
        return ResponseEntity.ok(appointmentService.getMySchedule(doktorId));
    }

    @PostMapping
    public ResponseEntity<Schedule> addSchedule(@RequestBody Schedule schedule) {
        return ResponseEntity.ok(appointmentService.addSchedule(schedule));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        appointmentService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
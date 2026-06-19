package com.medplatform.user_service.controller;

import com.medplatform.user_service.model.Doctor;
import com.medplatform.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(userService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getDoctorById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> search(
            @RequestParam(required = false) String specijalnost,
            @RequestParam(required = false) String grad,
            @RequestParam(required = false) String ime) {
        return ResponseEntity.ok(userService.searchDoctors(specijalnost, grad, ime));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            Doctor doctor = userService.createDoctorFromAdmin(request);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor doctor) {
        return ResponseEntity.ok(userService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
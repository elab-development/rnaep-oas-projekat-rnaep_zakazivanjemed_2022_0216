package com.medplatform.user_service.controller;

import com.medplatform.user_service.model.Institution;
import com.medplatform.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/institutions")
@RequiredArgsConstructor
public class InstitutionController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Institution>> getAll() {
        return ResponseEntity.ok(userService.getAllInstitutions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getInstitutionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Institution> create(@RequestBody Institution institution) {
        return ResponseEntity.ok(userService.createInstitution(institution));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Institution> update(@PathVariable Long id, @RequestBody Institution institution) {
        return ResponseEntity.ok(userService.updateInstitution(id, institution));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteInstitution(id);
        return ResponseEntity.noContent().build();
    }
}
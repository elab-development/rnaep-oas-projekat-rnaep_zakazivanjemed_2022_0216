package com.medplatform.user_service.controller;

import com.medplatform.user_service.model.Institution;
import com.medplatform.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/institutions")
@RequiredArgsConstructor
public class InstitutionController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Institution>> getAll() {
        return ResponseEntity.ok(userService.getAllInstitutions());
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
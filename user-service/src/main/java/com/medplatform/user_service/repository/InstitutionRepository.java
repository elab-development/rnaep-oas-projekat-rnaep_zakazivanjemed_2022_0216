package com.medplatform.user_service.repository;

import com.medplatform.user_service.model.Institution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {
}
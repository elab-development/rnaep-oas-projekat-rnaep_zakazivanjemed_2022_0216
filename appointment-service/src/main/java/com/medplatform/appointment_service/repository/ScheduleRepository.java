package com.medplatform.appointment_service.repository;

import com.medplatform.appointment_service.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoktorId(Long doktorId);
}
package com.medplatform.appointment_service.repository;

import com.medplatform.appointment_service.model.Appointment;
import com.medplatform.appointment_service.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPacijentId(Long pacijentId);
    List<Appointment> findByDoktorId(Long doktorId);
    List<Appointment> findByDoktorIdAndDatum(Long doktorId, LocalDate datum);
    boolean existsByDoktorIdAndDatumAndVreme(Long doktorId, java.time.LocalDate datum, java.time.LocalTime vreme);
}
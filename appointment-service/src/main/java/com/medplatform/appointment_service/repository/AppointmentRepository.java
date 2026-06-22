package com.medplatform.appointment_service.repository;

import com.medplatform.appointment_service.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPacijentId(Long pacijentId);
    List<Appointment> findByDoktorId(Long doktorId);
    List<Appointment> findByDoktorIdAndDatum(Long doktorId, LocalDate datum);
    List<Appointment> findByDatum(LocalDate datum);
    boolean existsByDoktorIdAndDatumAndVreme(Long doktorId, LocalDate datum, LocalTime vreme);
}
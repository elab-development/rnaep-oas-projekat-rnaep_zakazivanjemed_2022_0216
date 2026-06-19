package com.medplatform.user_service.repository;

import com.medplatform.user_service.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT d FROM Doctor d " +
            "LEFT JOIN d.institucija i " +
            "LEFT JOIN d.user u " +
            "WHERE (:specijalnost IS NULL OR :specijalnost = '' OR LOWER(d.specijalnost) LIKE LOWER(CONCAT('%', :specijalnost, '%'))) AND " +
            "(:grad IS NULL OR :grad = '' OR LOWER(i.grad) LIKE LOWER(CONCAT('%', :grad, '%'))) AND " +
            "(:ime IS NULL OR :ime = '' OR LOWER(u.ime) LIKE LOWER(CONCAT('%', :ime, '%')) OR LOWER(u.prezime) LIKE LOWER(CONCAT('%', :ime, '%')))")
    List<Doctor> search(@Param("specijalnost") String specijalnost,
                        @Param("grad") String grad,
                        @Param("ime") String ime);
}
package com.medplatform.user_service.service;

import com.medplatform.user_service.dto.AuthResponse;
import com.medplatform.user_service.dto.LoginRequest;
import com.medplatform.user_service.dto.RegisterRequest;
import com.medplatform.user_service.model.Doctor;
import com.medplatform.user_service.model.Institution;
import com.medplatform.user_service.model.Role;
import com.medplatform.user_service.model.User;
import com.medplatform.user_service.repository.DoctorRepository;
import com.medplatform.user_service.repository.InstitutionRepository;
import com.medplatform.user_service.repository.UserRepository;
import com.medplatform.user_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email je već registrovan");
        }

        User user = User.builder()
                .ime(request.getIme())
                .prezime(request.getPrezime())
                .email(request.getEmail())
                .lozinka(passwordEncoder.encode(request.getLozinka()))
                .uloga(request.getUloga() != null ? request.getUloga() : Role.PACIJENT)
                .build();

        user = userRepository.save(user);

        if (user.getUloga() == Role.DOKTOR) {
            Doctor doctor = Doctor.builder().user(user).build();
            doctorRepository.save(doctor);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getUloga().name());
        return buildAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        if (!passwordEncoder.matches(request.getLozinka(), user.getLozinka())) {
            throw new RuntimeException("Pogrešna lozinka");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getUloga().name());
        return buildAuthResponse(token, user);
    }

    // ── Doctors ──────────────────────────────────────────

    public List<Doctor> searchDoctors(String specijalnost, String grad, String ime) {
        return doctorRepository.search(specijalnost, grad, ime);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
        if (updatedDoctor.getSpecijalnost() != null) doctor.setSpecijalnost(updatedDoctor.getSpecijalnost());
        if (updatedDoctor.getBiografija() != null) doctor.setBiografija(updatedDoctor.getBiografija());
        if (updatedDoctor.getLicencniBroj() != null) doctor.setLicencniBroj(updatedDoctor.getLicencniBroj());
        if (updatedDoctor.getInstitucija() != null) doctor.setInstitucija(updatedDoctor.getInstitucija());
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // ── Institutions ──────────────────────────────────────

    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    public Institution createInstitution(Institution institution) {
        return institutionRepository.save(institution);
    }

    public Institution updateInstitution(Long id, Institution updated) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ustanova nije pronađena"));
        if (updated.getNaziv() != null) institution.setNaziv(updated.getNaziv());
        if (updated.getAdresa() != null) institution.setAdresa(updated.getAdresa());
        if (updated.getGrad() != null) institution.setGrad(updated.getGrad());
        if (updated.getTelefon() != null) institution.setTelefon(updated.getTelefon());
        if (updated.getLat() != null) institution.setLat(updated.getLat());
        if (updated.getLng() != null) institution.setLng(updated.getLng());
        return institutionRepository.save(institution);
    }

    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }

    // ── Helper ────────────────────────────────────────────

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .ime(user.getIme())
                        .prezime(user.getPrezime())
                        .email(user.getEmail())
                        .uloga(user.getUloga())
                        .build())
                .build();
    }
}
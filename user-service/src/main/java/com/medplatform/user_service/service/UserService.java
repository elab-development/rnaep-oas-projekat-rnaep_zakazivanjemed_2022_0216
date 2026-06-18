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

        // Ako je doktor, napravi Doctor entitet
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

    public Doctor createDoctor(Long userId, String specijalnost, Long institucijId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        Institution institucija = institucijId != null ?
                institutionRepository.findById(institucijId).orElse(null) : null;

        Doctor doctor = Doctor.builder()
                .user(user)
                .specijalnost(specijalnost)
                .institucija(institucija)
                .build();
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    public Institution createInstitution(Institution institution) {
        return institutionRepository.save(institution);
    }

    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }

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
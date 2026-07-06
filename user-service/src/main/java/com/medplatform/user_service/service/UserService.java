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
import java.util.Map;

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

        Role uloga = request.getUloga() != null ? request.getUloga() : Role.PACIJENT;

        User.UserBuilder userBuilder = User.builder()
                .ime(request.getIme())
                .prezime(request.getPrezime())
                .email(request.getEmail())
                .lozinka(passwordEncoder.encode(request.getLozinka()))
                .uloga(uloga)
                .telefon(request.getTelefon());

        // Ako je pacijent i izabrao je matičnog lekara, povežemo
        if (uloga == Role.PACIJENT && request.getMaticniLekarId() != null) {
            Doctor maticniLekar = doctorRepository.findById(request.getMaticniLekarId())
                    .orElse(null);
            userBuilder.maticniLekar(maticniLekar);
        }

        User user = userBuilder.build();
        user = userRepository.save(user);

        // Ako je doktor, napravi Doctor entitet (bez institucije - admin dodeljuje kasnije)
        if (user.getUloga() == Role.DOKTOR) {
            Doctor doctor = Doctor.builder().user(user).build();
            doctorRepository.save(doctor);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUloga().name());
        return buildAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        if (!passwordEncoder.matches(request.getLozinka(), user.getLozinka())) {
            throw new RuntimeException("Pogrešna lozinka");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUloga().name());
        return buildAuthResponse(token, user);
    }

    // ── Pacijent profil ────────────────────────────────────

    public User updateMaticniLekar(Long userId, Long doktorId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        if (user.getUloga() != Role.PACIJENT) {
            throw new RuntimeException("Samo pacijenti mogu imati matičnog lekara");
        }
        Doctor doctor = doctorRepository.findById(doktorId)
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
        user.setMaticniLekar(doctor);
        return userRepository.save(user);
    }

    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
    }

    public User updateProfile(Long userId, String ime, String prezime, String telefon, String adresa) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        if (ime != null && !ime.isBlank()) user.setIme(ime);
        if (prezime != null && !prezime.isBlank()) user.setPrezime(prezime);
        if (telefon != null) user.setTelefon(telefon);
        if (adresa != null) user.setAdresa(adresa);
        return userRepository.save(user);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        if (!passwordEncoder.matches(currentPassword, user.getLozinka())) {
            throw new RuntimeException("Trenutna lozinka nije ispravna");
        }
        if (newPassword.length() < 6) {
            throw new RuntimeException("Nova lozinka mora imati najmanje 6 karaktera");
        }
        user.setLozinka(passwordEncoder.encode(newPassword));
        userRepository.save(user);
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

    public Doctor createDoctorFromAdmin(Map<String, Object> request) {
        String email = (String) request.get("email");
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email je već registrovan");
        }

        User user = User.builder()
                .ime((String) request.get("ime"))
                .prezime((String) request.get("prezime"))
                .email(email)
                .lozinka(passwordEncoder.encode(request.get("ime") + "123"))
                .uloga(Role.DOKTOR)
                .build();
        user = userRepository.save(user);

        Institution institucija = null;
        Object institucijaId = request.get("institucija");
        if (institucijaId != null && !institucijaId.toString().isBlank()) {
            Long instId = Long.valueOf(institucijaId.toString());
            institucija = institutionRepository.findById(instId).orElse(null);
        }

        Doctor doctor = Doctor.builder()
                .user(user)
                .specijalnost((String) request.get("specijalnost"))
                .institucija(institucija)
                .build();
        return doctorRepository.save(doctor);
    }

    // Admin dodeljuje/menja instituciju postojećem doktoru
    public Doctor assignInstitution(Long doctorId, Long institucijaId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
        Institution institucija = institutionRepository.findById(institucijaId)
                .orElseThrow(() -> new RuntimeException("Ustanova nije pronađena"));
        doctor.setInstitucija(institucija);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // ── Institutions ──────────────────────────────────────

    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }

    public Institution getInstitutionById(Long id) {
        return institutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ustanova nije pronađena"));
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
                        .telefon(user.getTelefon())
                        .build())
                .build();
    }
}
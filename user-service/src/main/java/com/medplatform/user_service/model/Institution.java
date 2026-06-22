package com.medplatform.user_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "institutions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String naziv;

    private String adresa;

    private String grad;

    private String telefon;

    private Double lat;

    private Double lng;

    @JsonIgnore
    @OneToMany(mappedBy = "institucija", fetch = FetchType.LAZY)
    private List<Doctor> lekari;
}
package com.medplatform.user_service;

import com.medplatform.user_service.dto.AuthResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthResponseTest {

    @Test
    void builderPostavljaTokenIKorisnika() {
        AuthResponse.UserDto user = AuthResponse.UserDto.builder()
                .id(1L)
                .ime("Ana")
                .prezime("Anić")
                .email("ana@example.com")
                .build();

        AuthResponse response = AuthResponse.builder()
                .token("jwt-token")
                .user(user)
                .build();

        assertEquals("jwt-token", response.getToken());
        assertEquals("Ana", response.getUser().getIme());
        assertEquals("ana@example.com", response.getUser().getEmail());
    }
}
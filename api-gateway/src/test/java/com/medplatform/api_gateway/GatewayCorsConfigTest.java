package com.medplatform.api_gateway;

import org.junit.jupiter.api.Test;
import org.springframework.web.filter.CorsFilter;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class GatewayCorsConfigTest {

    @Test
    void corsFilterBeanNijeNull() {
        CorsFilter filter = new GatewayCorsConfig().corsFilter();
        assertNotNull(filter);
    }
}
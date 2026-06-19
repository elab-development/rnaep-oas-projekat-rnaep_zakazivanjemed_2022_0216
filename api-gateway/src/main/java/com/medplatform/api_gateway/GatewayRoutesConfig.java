package com.medplatform.api_gateway;

import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouterFunction<ServerResponse> userServiceRoutes() {
        return GatewayRouterFunctions.route("user-service")
                .route(path("/api/auth/**"), http())
                .before(uri("http://localhost:8081"))
                .build()
                .and(
                        GatewayRouterFunctions.route("user-service-doctors")
                                .route(path("/api/doctors/**"), http())
                                .before(uri("http://localhost:8081"))
                                .build()
                )
                .and(
                        GatewayRouterFunctions.route("user-service-institutions")
                                .route(path("/api/institutions/**"), http())
                                .before(uri("http://localhost:8081"))
                                .build()
                );
    }

    @Bean
    public RouterFunction<ServerResponse> appointmentServiceRoutes() {
        return GatewayRouterFunctions.route("appointment-service")
                .route(path("/api/appointments/**"), http())
                .before(uri("http://localhost:8082"))
                .build()
                .and(
                        GatewayRouterFunctions.route("appointment-schedules")
                                .route(path("/api/schedules/**"), http())
                                .before(uri("http://localhost:8082"))
                                .build()
                );
    }

    @Bean
    public RouterFunction<ServerResponse> medicalRecordsServiceRoutes() {
        return GatewayRouterFunctions.route("medical-records-service")
                .route(path("/api/medical-records/**"), http())
                .before(uri("http://localhost:8083"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoutes() {
        return GatewayRouterFunctions.route("notification-service")
                .route(path("/api/notifications/**"), http())
                .before(uri("http://localhost:8084"))
                .build();
    }
}
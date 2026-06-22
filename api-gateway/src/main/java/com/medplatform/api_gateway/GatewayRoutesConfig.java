package com.medplatform.api_gateway;

import org.springframework.beans.factory.annotation.Value;
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

    @Value("${services.user-service:http://localhost:8081}")
    private String userServiceUrl;

    @Value("${services.appointment-service:http://localhost:8082}")
    private String appointmentServiceUrl;

    @Value("${services.medical-records-service:http://localhost:8083}")
    private String medicalRecordsServiceUrl;

    @Value("${services.notification-service:http://localhost:8084}")
    private String notificationServiceUrl;

    @Bean
    public RouterFunction<ServerResponse> userServiceRoutes() {
        return GatewayRouterFunctions.route("user-service-auth")
                .route(path("/api/auth/**"), http())
                .before(uri(userServiceUrl))
                .build()
                .and(
                        GatewayRouterFunctions.route("user-service-doctors")
                                .route(path("/api/doctors/**"), http())
                                .before(uri(userServiceUrl))
                                .build()
                )
                .and(
                        GatewayRouterFunctions.route("user-service-institutions")
                                .route(path("/api/institutions/**"), http())
                                .before(uri(userServiceUrl))
                                .build()
                )
                .and(
                        GatewayRouterFunctions.route("user-service-users")
                                .route(path("/api/users/**"), http())
                                .before(uri(userServiceUrl))
                                .build()
                );
    }

    @Bean
    public RouterFunction<ServerResponse> appointmentServiceRoutes() {
        return GatewayRouterFunctions.route("appointment-service")
                .route(path("/api/appointments/**"), http())
                .before(uri(appointmentServiceUrl))
                .build()
                .and(
                        GatewayRouterFunctions.route("appointment-schedules")
                                .route(path("/api/schedules/**"), http())
                                .before(uri(appointmentServiceUrl))
                                .build()
                );
    }

    @Bean
    public RouterFunction<ServerResponse> medicalRecordsServiceRoutes() {
        return GatewayRouterFunctions.route("medical-records-service")
                .route(path("/api/medical-records/**"), http())
                .before(uri(medicalRecordsServiceUrl))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> notificationServiceRoutes() {
        return GatewayRouterFunctions.route("notification-service")
                .route(path("/api/notifications/**"), http())
                .before(uri(notificationServiceUrl))
                .build();
    }
}
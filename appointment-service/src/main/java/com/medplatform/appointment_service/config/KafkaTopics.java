package com.medplatform.appointment_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopics {

    public static final String APPOINTMENT_CREATED     = "appointment-created";
    public static final String APPOINTMENT_CANCELLED   = "appointment-cancelled";
    public static final String APPOINTMENT_RESCHEDULED = "appointment-rescheduled";
    public static final String APPOINTMENT_COMPLETED   = "appointment-completed";

    @Bean
    public NewTopic appointmentCreatedTopic() {
        return TopicBuilder.name(APPOINTMENT_CREATED).partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic appointmentCancelledTopic() {
        return TopicBuilder.name(APPOINTMENT_CANCELLED).partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic appointmentRescheduledTopic() {
        return TopicBuilder.name(APPOINTMENT_RESCHEDULED).partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic appointmentCompletedTopic() {
        return TopicBuilder.name(APPOINTMENT_COMPLETED).partitions(1).replicas(1).build();
    }
}
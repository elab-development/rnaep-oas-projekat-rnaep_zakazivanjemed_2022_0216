package com.medplatform.medical_records_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopics {

    public static final String APPOINTMENT_COMPLETED  = "appointment-completed";
    public static final String APPOINTMENT_CREATED    = "appointment-created";
    public static final String APPOINTMENT_FAILED     = "appointment-failed";
    public static final String MEDICAL_RECORD_CREATED = "medical-record-created";

    @Bean
    public NewTopic medicalRecordCreatedTopic() {
        return TopicBuilder.name(MEDICAL_RECORD_CREATED).partitions(1).replicas(1).build();
    }
}
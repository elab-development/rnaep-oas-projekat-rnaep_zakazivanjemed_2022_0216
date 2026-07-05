package com.medplatform.notification_service.config;

import com.medplatform.notification_service.event.AppointmentEvent;
import com.medplatform.notification_service.event.MedicalRecordCreatedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id:notification-service}")
    private String groupId;

    private Map<String, Object> baseProps() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return props;
    }

    // ── AppointmentEvent (created / cancelled / rescheduled / reminder) ──
    @Bean
    public ConsumerFactory<String, AppointmentEvent> appointmentConsumerFactory() {
        JacksonJsonDeserializer<AppointmentEvent> jsonDeserializer =
                new JacksonJsonDeserializer<>(AppointmentEvent.class, false);
        jsonDeserializer.addTrustedPackages("*");
        return new DefaultKafkaConsumerFactory<>(
                baseProps(), new StringDeserializer(),
                new ErrorHandlingDeserializer<>(jsonDeserializer));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, AppointmentEvent>
    appointmentKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, AppointmentEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(appointmentConsumerFactory());
        return factory;
    }

    // ── MedicalRecordCreatedEvent ──
    @Bean
    public ConsumerFactory<String, MedicalRecordCreatedEvent> medicalRecordConsumerFactory() {
        JacksonJsonDeserializer<MedicalRecordCreatedEvent> jsonDeserializer =
                new JacksonJsonDeserializer<>(MedicalRecordCreatedEvent.class, false);
        jsonDeserializer.addTrustedPackages("*");
        return new DefaultKafkaConsumerFactory<>(
                baseProps(), new StringDeserializer(),
                new ErrorHandlingDeserializer<>(jsonDeserializer));
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, MedicalRecordCreatedEvent>
    medicalRecordKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, MedicalRecordCreatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(medicalRecordConsumerFactory());
        return factory;
    }
}
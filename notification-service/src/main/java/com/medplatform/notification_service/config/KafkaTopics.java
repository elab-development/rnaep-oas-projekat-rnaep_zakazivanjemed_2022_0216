package com.medplatform.notification_service.config;

public final class KafkaTopics {

    private KafkaTopics() {}

    public static final String APPOINTMENT_CREATED     = "appointment-created";
    public static final String APPOINTMENT_CANCELLED   = "appointment-cancelled";
    public static final String APPOINTMENT_RESCHEDULED = "appointment-rescheduled";
    public static final String APPOINTMENT_REMINDER    = "appointment-reminder";
    public static final String MEDICAL_RECORD_CREATED  = "medical-record-created"; // Faza 2
}
package com.medplatform.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.SimpleMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String APPOINTMENT_QUEUE = "appointment.queue";
    public static final String CANCEL_QUEUE = "appointment.cancel.queue";
    public static final String RESCHEDULE_QUEUE = "appointment.reschedule.queue";
    public static final String REMINDER_QUEUE = "appointment.reminder.queue";

    public static final String EXCHANGE = "appointment.exchange";

    public static final String BOOKING_KEY = "appointment.booked";
    public static final String CANCEL_KEY = "appointment.cancelled";
    public static final String RESCHEDULE_KEY = "appointment.rescheduled";
    public static final String REMINDER_KEY = "appointment.reminder";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue appointmentQueue() { return new Queue(APPOINTMENT_QUEUE, true); }

    @Bean
    public Queue cancelQueue() { return new Queue(CANCEL_QUEUE, true); }

    @Bean
    public Queue rescheduleQueue() { return new Queue(RESCHEDULE_QUEUE, true); }

    @Bean
    public Queue reminderQueue() { return new Queue(REMINDER_QUEUE, true); }

    @Bean
    public Binding bookingBinding() {
        return BindingBuilder.bind(appointmentQueue()).to(exchange()).with(BOOKING_KEY);
    }

    @Bean
    public Binding cancelBinding() {
        return BindingBuilder.bind(cancelQueue()).to(exchange()).with(CANCEL_KEY);
    }

    @Bean
    public Binding rescheduleBinding() {
        return BindingBuilder.bind(rescheduleQueue()).to(exchange()).with(RESCHEDULE_KEY);
    }

    @Bean
    public Binding reminderBinding() {
        return BindingBuilder.bind(reminderQueue()).to(exchange()).with(REMINDER_KEY);
    }

    @Bean
    public SimpleMessageConverter messageConverter() {
        return new SimpleMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
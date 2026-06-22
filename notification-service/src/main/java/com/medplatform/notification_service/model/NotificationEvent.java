package com.medplatform.notification_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String tip;         // ZAKAZIVANJE, OTKAZIVANJE, IZMENA, PODSETNIK
    private String email;
    private String imePacijenta;
    private String imeDoktora;
    private String prezimeDoktora;
    private String datum;
    private String vreme;
}
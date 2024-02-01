package com.sd.monitoringcomunicationsystem.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomMessage {
    private Long id;
    private UUID uid;
    private String description;
    private BigDecimal maximumHourlyConsumption;
    private UUID userUid;
}
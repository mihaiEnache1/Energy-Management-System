package com.sd.energymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    private UUID uid;
    private String description;
    private String address;
    private BigDecimal maximumHourlyConsumption;
    private UUID userUid;
}

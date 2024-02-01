package com.sd.monitoringcomunicationsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumptionDto {
    private Date timestamp;
    private BigDecimal energyValue;
}

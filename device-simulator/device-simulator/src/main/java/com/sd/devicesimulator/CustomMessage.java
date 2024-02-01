package com.sd.devicesimulator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CustomMessage {
    private Date timestamp;
    private UUID deviceUid;
    private BigDecimal measurementValue;
    private int noOfSentValues;
    private BigDecimal totalHourlyConsumption;
}

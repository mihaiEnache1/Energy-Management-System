package com.sd.monitoringcomunicationsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    @Id
    private Long id;
    private UUID deviceUid;
    private UUID userUid;
    private String description;
    private BigDecimal maximumHourlyConsumption;
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Consumption> deviceHourlyConsumptions;
}

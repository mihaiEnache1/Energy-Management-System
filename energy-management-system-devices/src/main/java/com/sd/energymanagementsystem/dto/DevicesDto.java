package com.sd.energymanagementsystem.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class DevicesDto {
    List<UUID> devicesUid;
}

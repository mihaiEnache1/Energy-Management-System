package com.sd.monitoringcomunicationsystem.message;

import lombok.Data;

import java.util.UUID;

@Data
public class SocketMessage {
    private String message;
    private UUID deviceUid;
}

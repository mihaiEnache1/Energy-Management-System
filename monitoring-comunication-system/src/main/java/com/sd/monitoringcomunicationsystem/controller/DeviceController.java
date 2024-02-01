package com.sd.monitoringcomunicationsystem.controller;

import com.sd.monitoringcomunicationsystem.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/monitoring-device")
public class DeviceController {
    private final DeviceService deviceService;

    @DeleteMapping("/{deviceUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable UUID deviceUid) {
        deviceService.deleteDevice(deviceUid);
        return ResponseEntity.noContent().build();
    }
}

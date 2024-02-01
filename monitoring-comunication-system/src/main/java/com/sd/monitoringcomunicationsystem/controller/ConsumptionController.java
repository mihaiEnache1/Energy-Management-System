package com.sd.monitoringcomunicationsystem.controller;

import com.sd.monitoringcomunicationsystem.dto.ConsumptionDto;
import com.sd.monitoringcomunicationsystem.service.ConsumptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/consumptions")
public class ConsumptionController {
    private final ConsumptionService service;

    @GetMapping("/{deviceUid}")
    @PreAuthorize("hasAuthority('CLIENT')")
    public ResponseEntity<List<ConsumptionDto>> getAllConsumptionsByDeviceUid(@PathVariable UUID deviceUid) {
        return new ResponseEntity<>(service.getAllConsumptionByDeviceUid(deviceUid), HttpStatus.OK);
    }
}

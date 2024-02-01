package com.sd.energymanagementsystem.controller;

import com.sd.energymanagementsystem.dto.DeviceDto;
import com.sd.energymanagementsystem.dto.DevicesDto;
import com.sd.energymanagementsystem.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;

    @PostMapping
    public ResponseEntity<DeviceDto> save(@RequestBody DeviceDto deviceDto) {
        return new ResponseEntity<>(deviceService.save(deviceDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DeviceDto>> getAllDevices() {
        return new ResponseEntity<>(deviceService.getAllDevices(), HttpStatus.OK);
    }

    @GetMapping("/get-device/{deviceUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DeviceDto> getDeviceByUid(@PathVariable UUID deviceUid) {
        return new ResponseEntity<>(deviceService.getDeviceByUid(deviceUid), HttpStatus.OK);
    }

    @GetMapping("/{userUid}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    public ResponseEntity<List<DeviceDto>> getAllDevicesByUserUid(@PathVariable UUID userUid) {
        return new ResponseEntity<>(deviceService.getAllDevicesByUserUid(userUid), HttpStatus.OK);
    }

    @GetMapping("/free-devices")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<DeviceDto>> getAllFreeDevices() {
        return new ResponseEntity<>(deviceService.getAllFreeDevices(), HttpStatus.OK);
    }

    @PutMapping("/{deviceUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DeviceDto> update(@PathVariable UUID deviceUid, @RequestBody DeviceDto deviceDto) {
        return new ResponseEntity<>(deviceService.update(deviceUid, deviceDto), HttpStatus.OK);
    }

    @PutMapping("/map/{userUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> assignDevicesToUser(@PathVariable UUID userUid, @RequestBody DevicesDto devicesUid) {
        deviceService.assignDevicesToUser(userUid, devicesUid);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-user-id/{userUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> unassignDevicesToUser(@PathVariable UUID userUid) {
        deviceService.deleteUserUid(userUid);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{deviceUid}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID deviceUid) {
        deviceService.delete(deviceUid);
        return ResponseEntity.noContent().build();
    }
}

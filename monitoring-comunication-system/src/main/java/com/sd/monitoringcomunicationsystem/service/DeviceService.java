package com.sd.monitoringcomunicationsystem.service;

import com.sd.monitoringcomunicationsystem.repository.MonitoringRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final MonitoringRepository repository;

    @Transactional
    public void deleteDevice(UUID deviceUid) {
        repository.deleteByDeviceUid(deviceUid);
    }
}

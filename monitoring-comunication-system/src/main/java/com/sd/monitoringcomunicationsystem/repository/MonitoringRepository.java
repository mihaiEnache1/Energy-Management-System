package com.sd.monitoringcomunicationsystem.repository;

import com.sd.monitoringcomunicationsystem.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonitoringRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByDeviceUid(UUID deviceUid);
    void deleteByDeviceUid(UUID deviceUid);
}

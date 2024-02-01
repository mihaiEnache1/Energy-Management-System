package com.sd.energymanagementsystem.repository;

import com.sd.energymanagementsystem.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findDevicesByUserUid(UUID userUid);
    Optional<Device> findByUid(UUID deviceUid);
    void deleteByUid(UUID deviceUid);
    List<Device> findAllByUserUid(UUID userUid);
}

package com.sd.monitoringcomunicationsystem.repository;

import com.sd.monitoringcomunicationsystem.model.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, Long> {
    List<Consumption> findByDeviceId(Long deviceId);
}

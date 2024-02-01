package com.sd.monitoringcomunicationsystem.service;

import com.sd.monitoringcomunicationsystem.dto.ConsumptionDto;
import com.sd.monitoringcomunicationsystem.model.Consumption;
import com.sd.monitoringcomunicationsystem.model.Device;
import com.sd.monitoringcomunicationsystem.repository.ConsumptionRepository;
import com.sd.monitoringcomunicationsystem.repository.MonitoringRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ConsumptionService {
    private final MonitoringRepository monitoringRepository;
    private final ConsumptionRepository consumptionRepository;
    private final ModelMapper modelMapper;

    public List<ConsumptionDto> getAllConsumptionByDeviceUid(UUID deviceUid) {
        Device device = monitoringRepository.findByDeviceUid(deviceUid).orElseThrow(() -> new RuntimeException("Device not found"));
        List<Consumption> consumptions = consumptionRepository.findByDeviceId(device.getId());
        List<ConsumptionDto> consumptionDtos = new ArrayList<>();
        for (Consumption consumption :  consumptions) {
            ConsumptionDto consumptionDto = modelMapper.map(consumption, ConsumptionDto.class);
            consumptionDtos.add(consumptionDto);
        }
        consumptionDtos.sort(Comparator.comparing(ConsumptionDto::getTimestamp));
        return consumptionDtos;
    }
}

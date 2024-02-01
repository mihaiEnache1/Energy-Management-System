package com.sd.energymanagementsystem.service;

import com.sd.energymanagementsystem.dto.DeviceDto;
import com.sd.energymanagementsystem.dto.DevicesDto;
import com.sd.energymanagementsystem.model.Device;
import com.sd.energymanagementsystem.rabbit.CustomMessage;
import com.sd.energymanagementsystem.rabbit.MQConfig;
import com.sd.energymanagementsystem.repository.DeviceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final ModelMapper modelMapper;
    private final DeviceRepository deviceRepository;
    private final RabbitTemplate template;

    public DeviceDto save(DeviceDto deviceDto) {
        Device device = modelMapper.map(deviceDto, Device.class);
        device.setUid(UUID.randomUUID());
        Device savedDevice = deviceRepository.save(device);
        CustomMessage message = new CustomMessage(savedDevice.getId(), savedDevice.getUid(), savedDevice.getDescription(), savedDevice.getMaximumHourlyConsumption(), savedDevice.getUserUid());
        template.convertAndSend(MQConfig.EXCHANGE, MQConfig.ROUTING_KEY, message);
        return modelMapper.map(savedDevice, DeviceDto.class);
    }

    public List<DeviceDto> getAllDevices() {
        return deviceRepository.findAll().stream().map(device -> modelMapper.map(device, DeviceDto.class)).collect(Collectors.toList());
    }

    public DeviceDto getDeviceByUid(UUID deviceUid) {
        Device device = deviceRepository.findByUid(deviceUid).orElseThrow(() -> new RuntimeException("Device not found"));
        return modelMapper.map(device, DeviceDto.class);
    }

    public List<DeviceDto> getAllDevicesByUserUid(UUID userUid) {
        return deviceRepository.findDevicesByUserUid(userUid).stream().map(device -> modelMapper.map(device, DeviceDto.class)).collect(Collectors.toList());
    }

    public DeviceDto update(UUID deviceUid, DeviceDto deviceDto) {
        Device existingDevice = deviceRepository.findByUid(deviceUid).orElseThrow(() -> new RuntimeException("Device not found"));
        Device updatedDevice = modelMapper.map(deviceDto, Device.class);
        updatedDevice.setId(existingDevice.getId());
        updatedDevice.setUid(existingDevice.getUid());
        updatedDevice.setUserUid(existingDevice.getUserUid());
        CustomMessage message = new CustomMessage(updatedDevice.getId(), updatedDevice.getUid(), updatedDevice.getDescription(), updatedDevice.getMaximumHourlyConsumption(), updatedDevice.getUserUid());
        template.convertAndSend(MQConfig.EXCHANGE, MQConfig.ROUTING_KEY, message);
        return modelMapper.map(deviceRepository.save(updatedDevice), DeviceDto.class);
    }

    public void assignDevicesToUser(UUID userUid, DevicesDto devicesUid) {
        for (UUID deviceUid : devicesUid.getDevicesUid()) {
            Device device = deviceRepository.findByUid(deviceUid).orElseThrow(() -> new RuntimeException("Device not found"));
            device.setUserUid(userUid);
            CustomMessage message = new CustomMessage(device.getId(), device.getUid(), device.getDescription(), device.getMaximumHourlyConsumption(), device.getUserUid());
            deviceRepository.save(device);
            template.convertAndSend(MQConfig.EXCHANGE, MQConfig.ROUTING_KEY, message);
        }
    }

    @Transactional
    public void delete(UUID deviceUid) {
        deviceRepository.deleteByUid(deviceUid);
    }

    public void deleteUserUid(UUID userUid) {
        List<Device> devices = deviceRepository.findAllByUserUid(userUid);
        for (Device device: devices) {
            System.out.println(device);
            device.setUserUid(null);
            System.out.println(device);
            deviceRepository.save(device);
            CustomMessage message = new CustomMessage(device.getId(), device.getUid(), device.getDescription(), device.getMaximumHourlyConsumption(), null);
            template.convertAndSend(MQConfig.EXCHANGE, MQConfig.ROUTING_KEY, message);
        }
    }

    public List<DeviceDto> getAllFreeDevices() {
        List<Device> devices = deviceRepository.findAll();
        List<DeviceDto> devicesDto = new ArrayList<>();
        for (Device device: devices) {
            if (device.getUserUid() == null) {
                devicesDto.add(modelMapper.map(device, DeviceDto.class));
            }
        }
        return devicesDto;
    }
}

package com.sd.monitoringcomunicationsystem.rabbit;

import com.sd.monitoringcomunicationsystem.config.MQConfig;
import com.sd.monitoringcomunicationsystem.message.CustomMessage;
import com.sd.monitoringcomunicationsystem.message.SimulatorMessage;
import com.sd.monitoringcomunicationsystem.message.SocketMessage;
import com.sd.monitoringcomunicationsystem.model.Consumption;
import com.sd.monitoringcomunicationsystem.model.Device;
import com.sd.monitoringcomunicationsystem.repository.ConsumptionRepository;
import com.sd.monitoringcomunicationsystem.repository.MonitoringRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MessageListener {
    private final MonitoringRepository repository;
    private final ConsumptionRepository consumptionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = MQConfig.QUEUE)
    public void listen(CustomMessage message) {
        Device device = new Device();
        device.setId(message.getId());
        device.setDeviceUid(message.getUid());
        device.setUserUid(message.getUserUid());
        device.setMaximumHourlyConsumption(message.getMaximumHourlyConsumption());
        device.setDescription(message.getDescription());

        System.out.println(message);

        repository.save(device);
    }

    @RabbitListener(queues = MQConfig.SIMULATOR_QUEUE)
    public void receive(SimulatorMessage message) {
        System.out.println(message);

        int noOfReceivedValues = message.getNoOfSentValues();
        BigDecimal totalHourlyConsumption = message.getTotalHourlyConsumption();

        System.out.println("No of received values: " + noOfReceivedValues);
        System.out.println("Total hourly consumption: " + totalHourlyConsumption);

        Device device = repository.findByDeviceUid(message.getDeviceUid()).orElseThrow(() -> new RuntimeException("Device not found"));
        Consumption newConsumption = new Consumption();
        newConsumption.setDevice(device);
        newConsumption.setTimestamp(message.getTimestamp());
        newConsumption.setEnergyValue(totalHourlyConsumption);

        if (noOfReceivedValues % 6 == 1) {
            consumptionRepository.save(newConsumption);
        } else {
            List<Consumption> existingConsumptions = consumptionRepository
                    .findByDeviceId(device.getId())
                    .stream()
                    .filter(consumption -> message.getTimestamp().getHours() == consumption.getTimestamp().getHours()
                            &&
                            message.getTimestamp().getMonth() == consumption.getTimestamp().getMonth()
                            &&
                            message.getTimestamp().getDay() == consumption.getTimestamp().getDay()
                            &&
                            message.getTimestamp().getYear() == consumption.getTimestamp().getYear()
                    )
                    .collect(Collectors.toList());
            System.out.println(existingConsumptions.size());
            if (existingConsumptions.size() > 0) {
//                int last = existingConsumptions.size() - 1;
                newConsumption.setId(existingConsumptions.get(0).getId());
                consumptionRepository.save(newConsumption);
            }
        }

        if (totalHourlyConsumption.compareTo(device.getMaximumHourlyConsumption()) > 0) {
            SocketMessage socketMessage = new SocketMessage();
            socketMessage.setMessage("Device " + device.getDescription() + " has exceeded the maximum hourly consumption!");
            socketMessage.setDeviceUid(device.getDeviceUid());
            messagingTemplate.convertAndSend("/topic/socket/client", socketMessage);
            System.out.println("Device " + device.getDescription() + " has exceeded the maximum hourly consumption!!!!");
        }
    }
}

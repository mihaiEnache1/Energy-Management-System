package com.sd.devicesimulator;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DeviceSimulatorService implements CommandLineRunner {
    private final RabbitTemplate template;

    @Override
    public void run(String... args) {
        List<String> devicesUid = readDevicesUidFromFile();

        int noOfSimulators = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(noOfSimulators);

        for (String deviceUid : devicesUid) {
            executorService.submit(() -> runSimulator(deviceUid));
        }

        executorService.shutdown();
        try {
            executorService.awaitTermination(10, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void runSimulator(String deviceUid) {
        BigDecimal lastConsumption = BigDecimal.valueOf(0.0);
        int minutes = 1;
        int hour = 0;
        int noOfSentValues = 0;
        int days = 0;
        BigDecimal totalHourlyConsumption = BigDecimal.ZERO;

//        try (BufferedReader br = new BufferedReader(new FileReader("/app/resources/sensor.csv"))) {
        try (BufferedReader br = new BufferedReader(new FileReader("./src/main/resources/sensor.csv"))) {
            String line;
            while ((line = br.readLine()) != null) {
                BigDecimal value = BigDecimal.valueOf(Double.parseDouble(line));
                CustomMessage message = new CustomMessage();

                synchronized (this) {
                    Date currentTime = new Date();
                    LocalDateTime currentHour = LocalDateTime.ofInstant(currentTime.toInstant(), java.time.ZoneId.systemDefault());

                    if ((currentHour.getHour() + hour) % 24 == 0 && minutes % 60 == 1) {
                        days++;
                        System.out.println("!!!!!!!!!!!!!PRINTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        System.out.println("DAYS: " + days);
                        System.out.println("!!!!!!!!!!!!!PRINTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    }

                    if (noOfSentValues % 6 == 0) {
                        totalHourlyConsumption = BigDecimal.ZERO;
                    }

                    int addedHours = (currentHour.getHour() + hour) % 24;
                    currentHour = currentHour.plusDays(days);
                    currentHour = currentHour.withHour(addedHours).withMinute(minutes).withSecond(0);
                    Instant instant = currentHour.atZone(java.time.ZoneId.systemDefault()).toInstant();
                    Date timestamp = Date.from(instant);

                    message.setTimestamp(timestamp);
                    message.setDeviceUid(UUID.fromString(deviceUid));
                    message.setMeasurementValue(value.subtract(lastConsumption));
                    totalHourlyConsumption = totalHourlyConsumption.add(value.subtract(lastConsumption));
                    lastConsumption = value;

                    minutes = (minutes + 10) % 60;
                    if (minutes % 60 == 1) {
                        hour = (hour + 1) % 24;
                    }

                    noOfSentValues++;
                    message.setNoOfSentValues(noOfSentValues);
                    message.setTotalHourlyConsumption(totalHourlyConsumption);

                    System.out.println(message);
                    template.convertAndSend(MQConfig.EXCHANGE, MQConfig.ROUTING_KEY, message);
                    System.out.println("No of sent values: " + noOfSentValues + " of thread: " + Thread.currentThread().getId());

                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private List<String> readDevicesUidFromFile() {
        List<String> devicesUid = new ArrayList<>();
//        try (BufferedReader br = new BufferedReader(new FileReader("/app/resources/devices-uids.txt"))) {
        try (BufferedReader br = new BufferedReader(new FileReader("./src/main/resources/devices-uids.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                devicesUid.add(line.trim());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return devicesUid;
    }
}
package com.fairshare.backend.service;

import com.fairshare.backend.model.EnergyReading;
import com.fairshare.backend.repository.EnergyReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EnergyService {

    @Autowired
    private EnergyReadingRepository energyRepository;

    public EnergyReading saveReading(EnergyReading reading) {
        if (reading.getCreatedAt() == null) {
            reading.setCreatedAt(new Date());
        }
        double totalCost = (reading.getUnits() * reading.getCostPerUnit());
        reading.setTotalCost(totalCost);
        return energyRepository.save(reading);
    }

    public List<EnergyReading> getAllReadings() {
        return energyRepository.findAll();
    }

    public void deleteReading(Long id) {
        energyRepository.deleteById(id);
    }

    public Map<String, Object> getAnalytics() {
        List<EnergyReading> readings = energyRepository.findAll();

        double totalUnits = readings.stream()
                .mapToDouble(r -> Optional.ofNullable(r.getUnits()).orElse(0.0))
                .sum();

        double totalCost = readings.stream()
                .mapToDouble(r -> Optional.ofNullable(r.getTotalCost()).orElse(0.0))
                .sum();

        double avgUnits = readings.isEmpty() ? 0 : totalUnits / readings.size();
        double avgCost = readings.isEmpty() ? 0 : totalCost / readings.size();

        Map<String, Double> monthlyConsumption = readings.stream()
                .filter(r -> r.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        r -> {
                            LocalDate date = r.getCreatedAt().toInstant()
                                    .atZone(ZoneId.systemDefault()).toLocalDate();
                            Month month = date.getMonth();
                            return month.name().substring(0, 3);
                        },
                        LinkedHashMap::new,
                        Collectors.summingDouble(r -> Optional.ofNullable(r.getUnits()).orElse(0.0))
                ));

        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("totalReadings", readings.size());
        analytics.put("totalUnits", totalUnits);
        analytics.put("totalCost", totalCost);
        analytics.put("avgUnits", avgUnits);
        analytics.put("avgCost", avgCost);
        analytics.put("monthlyConsumption", monthlyConsumption);

        return analytics;
    }
}

package com.fairshare.backend.controller;

import com.fairshare.backend.model.EnergyReading;
import com.fairshare.backend.service.EnergyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/energy")
@CrossOrigin(origins = "http://localhost:3000")
public class EnergyController {

    @Autowired
    private EnergyService energyService;

    @PostMapping
    public ResponseEntity<EnergyReading> createReading(@RequestBody EnergyReading reading) {
        return ResponseEntity.ok(energyService.saveReading(reading));
    }

    @GetMapping
    public ResponseEntity<List<EnergyReading>> getAllReadings() {
        return ResponseEntity.ok(energyService.getAllReadings());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReading(@PathVariable Long id) {
        energyService.deleteReading(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(energyService.getAnalytics());
    }
}

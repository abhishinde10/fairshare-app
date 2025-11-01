package com.fairshare.backend.controller;

import com.fairshare.backend.model.Chore;
import com.fairshare.backend.service.ChoreService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/chores")
public class ChoreController {

    private final ChoreService choreService;

    public ChoreController(ChoreService choreService) {
        this.choreService = choreService;
    }

    @GetMapping
    public List<Chore> getAll() {
        return choreService.getAll();
    }

    @PostMapping
    public Chore create(@RequestBody Map<String, String> data) {
        String title = data.get("title");
        String description = data.get("description");
        String frequency = data.getOrDefault("frequency", "once");
        LocalDate dueDate = LocalDate.parse(data.get("dueDate"));
        return choreService.create(title, description, dueDate, frequency);
    }

    @PutMapping("/{id}")
    public Chore updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "pending");
        return choreService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable UUID id) {
        choreService.delete(id);
        return Map.of("success", true);
    }
}

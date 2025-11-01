package com.fairshare.backend.controller;

import com.fairshare.backend.model.Roommate;
import com.fairshare.backend.service.RoommateService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/roommates")
public class RoommateController {
    private final RoommateService service;

    public RoommateController(RoommateService service) {
        this.service = service;
    }

    @GetMapping
    public List<Roommate> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Roommate add(@RequestBody Roommate roommate) {
        return service.add(roommate);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable UUID id) {
        service.delete(id);
        return Map.of("message", "Roommate deleted successfully");
    }

    @GetMapping("/sorted")
    public List<Roommate> getSortedByBehavior() {
        return service.getSortedByBehavior();
    }

    @GetMapping("/top")
    public List<Roommate> getTopPerformers(@RequestParam(defaultValue = "3") int n) {
        return service.getTopPerformers(n);
    }
}

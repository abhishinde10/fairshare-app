package com.fairshare.backend.controller;

import com.fairshare.backend.model.RoommateBehavior;
import com.fairshare.backend.service.BehaviorService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/behavior")
public class BehaviorController {

    private final BehaviorService service;

    public BehaviorController(BehaviorService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoommateBehavior> getAll() {
        return service.getAll();
    }

    @PostMapping("/update")
    public RoommateBehavior update(@RequestBody Map<String, Object> data) {
        String name = (String) data.get("name");
        String email = (String) data.get("email");
        double delta = Double.parseDouble(String.valueOf(data.getOrDefault("scoreDelta", 0)));
        return service.addOrUpdate(name, email, delta);
    }

    @GetMapping("/top")
    public List<RoommateBehavior> getTop(@RequestParam(defaultValue = "3") int k) {
        return service.getTopPerformers(k);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable UUID id) {
        service.delete(id);
        return Map.of("success", true);
    }
}

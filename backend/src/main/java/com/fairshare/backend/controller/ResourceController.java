package com.fairshare.backend.controller;

import com.fairshare.backend.model.Resource;
import com.fairshare.backend.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // ✅ Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ✅ Get single resource
    @GetMapping("/{id}")
    public ResponseEntity<?> getResourceById(@PathVariable Long id) {
        Optional<Resource> resource = resourceService.getResourceById(id);
        return resource.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Resource not found")));
    }

    // ✅ Create resource
    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.ok(created);
    }

    // ✅ Update resource
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable Long id, @RequestBody Resource updated) {
        Optional<Resource> updatedResource = resourceService.updateResource(id, updated);
        return updatedResource.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Resource not found")));
    }

    // ✅ Delete resource (return JSON)
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResource(@PathVariable Long id) {
        boolean deleted = resourceService.deleteResource(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Resource deleted successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Resource not found"));
        }
    }
}

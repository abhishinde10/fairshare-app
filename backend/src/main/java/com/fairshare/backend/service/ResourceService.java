package com.fairshare.backend.service;

import com.fairshare.backend.model.Resource;
import com.fairshare.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        if (resource.getStatus() == null || resource.getStatus().isBlank()) {
            resource.setStatus("available");
        }
        if (resource.getCategory() == null || resource.getCategory().isBlank()) {
            resource.setCategory("other");
        }
        if (resource.getDescription() == null) {
            resource.setDescription("No description provided");
        }
        return resourceRepository.save(resource);
    }


    public Optional<Resource> updateResource(Long id, Resource newDetails) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setName(newDetails.getName());
            resource.setCategory(newDetails.getCategory());
            resource.setStatus(newDetails.getStatus());
            return resourceRepository.save(resource);
        });
    }

    public boolean deleteResource(Long id) {
        if (resourceRepository.existsById(id)) {
            resourceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

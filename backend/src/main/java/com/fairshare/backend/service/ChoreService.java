package com.fairshare.backend.service;

import com.fairshare.backend.dsa.linkedlist.CircularLinkedList;
import com.fairshare.backend.model.Chore;
import com.fairshare.backend.repository.ChoreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ChoreService {

    private final ChoreRepository choreRepository;

    // Dummy members for round-robin assignment (later link to household members)
    private final List<String> members = Arrays.asList("Alice", "Bob", "Charlie");
    private final CircularLinkedList<String> assignmentList = new CircularLinkedList<>(members);

    public ChoreService(ChoreRepository choreRepository) {
        this.choreRepository = choreRepository;
    }

    public List<Chore> getAll() {
        return choreRepository.findAll();
    }

    public Chore create(String title, String description, LocalDate dueDate, String frequency) {
        String assignedTo = assignmentList.getCurrent();
        Chore chore = new Chore(title, description, dueDate, frequency, assignedTo);
        assignmentList.next(); // move to next user for the next assignment
        return choreRepository.save(chore);
    }

    public Chore updateStatus(UUID id, String status) {
        Chore chore = choreRepository.findById(id).orElseThrow(() -> new RuntimeException("Chore not found"));
        chore.setStatus(status);
        if ("completed".equalsIgnoreCase(status)) {
            // Reassign if frequency is recurring
            if (!"once".equalsIgnoreCase(chore.getFrequency())) {
                String nextMember = assignmentList.next();
                chore.setAssignedTo(nextMember);
                chore.setStatus("pending");
                chore.setDueDate(chore.getDueDate().plusDays(getFrequencyDays(chore.getFrequency())));
            }
        }
        return choreRepository.save(chore);
    }

    private int getFrequencyDays(String frequency) {
        return switch (frequency.toLowerCase()) {
            case "daily" -> 1;
            case "weekly" -> 7;
            case "monthly" -> 30;
            default -> 0;
        };
    }

    public void delete(UUID id) {
        choreRepository.deleteById(id);
    }
}

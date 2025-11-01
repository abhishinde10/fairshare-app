package com.fairshare.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chores")
public class Chore {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;
    private String description;
    private LocalDate dueDate;
    private String frequency; // once, daily, weekly, monthly
    private String status = "pending";
    private String assignedTo; // user email or name

    private LocalDateTime createdAt = LocalDateTime.now();

    public Chore() {}

    public Chore(String title, String description, LocalDate dueDate, String frequency, String assignedTo) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.frequency = frequency;
        this.assignedTo = assignedTo;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

package com.fairshare.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "roommate_behavior")
public class RoommateBehavior implements Comparable<RoommateBehavior> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String email;
    private double behaviorScore; // between 0–100
    private int completedChores;
    private int sharedBillsPaid;
    private int punctualityScore;

    public RoommateBehavior() {}

    public RoommateBehavior(String name, String email, double behaviorScore) {
        this.name = name;
        this.email = email;
        this.behaviorScore = behaviorScore;
        this.completedChores = 0;
        this.sharedBillsPaid = 0;
        this.punctualityScore = 50;
    }

    // ✅ Implement Comparable
    @Override
    public int compareTo(RoommateBehavior other) {
        // Higher score = “greater” roommate
        return Double.compare(this.behaviorScore, other.behaviorScore);
    }

    // ---- Getters & Setters ----
    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public double getBehaviorScore() { return behaviorScore; }
    public void setBehaviorScore(double behaviorScore) { this.behaviorScore = behaviorScore; }
    public int getCompletedChores() { return completedChores; }
    public void setCompletedChores(int completedChores) { this.completedChores = completedChores; }
    public int getSharedBillsPaid() { return sharedBillsPaid; }
    public void setSharedBillsPaid(int sharedBillsPaid) { this.sharedBillsPaid = sharedBillsPaid; }
    public int getPunctualityScore() { return punctualityScore; }
    public void setPunctualityScore(int punctualityScore) { this.punctualityScore = punctualityScore; }
}

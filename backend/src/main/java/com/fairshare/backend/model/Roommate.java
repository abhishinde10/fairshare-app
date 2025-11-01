package com.fairshare.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "roommates")
public class Roommate implements Comparable<Roommate> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;
    private String email;
    private int cleanliness;
    private int cooperation;
    private int responsibility;
    private int noiseLevel; // lower = better
    private double behaviorScore;

    public Roommate() {}

    public Roommate(String name, String email, int cleanliness, int cooperation, int responsibility, int noiseLevel) {
        this.name = name;
        this.email = email;
        this.cleanliness = cleanliness;
        this.cooperation = cooperation;
        this.responsibility = responsibility;
        this.noiseLevel = noiseLevel;
        calculateBehaviorScore();
    }

    public void calculateBehaviorScore() {
        this.behaviorScore = (cleanliness + cooperation + responsibility - noiseLevel) / 3.0;
    }

    @Override
    public int compareTo(Roommate other) {
        return Double.compare(this.behaviorScore, other.behaviorScore);
    }

    // Getters and setters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getCleanliness() { return cleanliness; }
    public void setCleanliness(int cleanliness) { this.cleanliness = cleanliness; calculateBehaviorScore(); }

    public int getCooperation() { return cooperation; }
    public void setCooperation(int cooperation) { this.cooperation = cooperation; calculateBehaviorScore(); }

    public int getResponsibility() { return responsibility; }
    public void setResponsibility(int responsibility) { this.responsibility = responsibility; calculateBehaviorScore(); }

    public int getNoiseLevel() { return noiseLevel; }
    public void setNoiseLevel(int noiseLevel) { this.noiseLevel = noiseLevel; calculateBehaviorScore(); }

    public double getBehaviorScore() { return behaviorScore; }
}

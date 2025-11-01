package com.fairshare.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String title;
    private BigDecimal amount;
    private LocalDate dueDate;
    private String category; // utilities, rent, groceries, other
    private String status = "pending"; // pending | paid
    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "bill_splits", joinColumns = @JoinColumn(name = "bill_id"))
    private List<BillSplit> splits = new ArrayList<>();

    public Bill() {}

    public Bill(String title, BigDecimal amount, LocalDate dueDate, String category) {
        this.title = title;
        this.amount = amount;
        this.dueDate = dueDate;
        this.category = category;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<BillSplit> getSplits() { return splits; }
    public void setSplits(List<BillSplit> splits) { this.splits = splits; }
}

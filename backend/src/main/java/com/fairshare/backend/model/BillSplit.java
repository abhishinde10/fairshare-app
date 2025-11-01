package com.fairshare.backend.model;

import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public class BillSplit {
    private BigDecimal amount = BigDecimal.ZERO;
    private boolean paid = false;

    public BillSplit() {}
    public BillSplit(BigDecimal amount, boolean paid) {
        this.amount = amount;
        this.paid = paid;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
}

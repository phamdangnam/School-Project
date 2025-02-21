package com.example.PocketPlan.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Amount")
public class Amount {
    @Id
    @Column(name="Amount", unique = true, nullable = false)
    private Long amount;

    public Amount() {
    }

    public Amount(long amount) {
        this.amount = amount;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }
}

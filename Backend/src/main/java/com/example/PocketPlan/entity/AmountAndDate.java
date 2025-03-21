package com.example.PocketPlan.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "AmountAndDate")
public class AmountAndDate {
    @Id
    @Column(name="Amount", unique = true, nullable = false)
    private Long amount;
    @Column(name="Date Range", unique = true, nullable = false)
    private String dateRange;

    public AmountAndDate(Long amount, String dateRange) {
        this.amount = amount;
        this.dateRange = dateRange;
    }

    public AmountAndDate() {
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getDateRange() {
        return dateRange;
    }

    public void setDateRange(String dateRange) {
        this.dateRange = dateRange;
    }
}

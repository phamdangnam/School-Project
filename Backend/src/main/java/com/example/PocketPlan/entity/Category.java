package com.example.PocketPlan.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Categories")
public class Category {
    @Id
    @Column(name="Category",nullable = false,unique = true)
    private String category;

    @Column(name="Percentage",nullable = false)
    private long percentage;

    public Category() {
    }

    public Category(String category, long percentage) {
        this.category = category;
        this.percentage = percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getPercentage() {
        return percentage;
    }

    public void setPercentage(long percentage) {
        this.percentage = percentage;
    }
}

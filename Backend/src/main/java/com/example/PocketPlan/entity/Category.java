package com.example.PocketPlan.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name="Categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id; // Auto-generated primary key
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

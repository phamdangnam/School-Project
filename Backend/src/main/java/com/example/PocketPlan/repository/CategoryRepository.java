package com.example.PocketPlan.repository;

import com.example.PocketPlan.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    void deleteByCategory(String category);
    Category findByCategory(String category);
}

package com.example.PocketPlan.service;


import com.example.PocketPlan.entity.Category;
import com.example.PocketPlan.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService{
    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public void save(Category category) {
        Category existingCategory = categoryRepository.findByCategory(category.getCategory());
        if (existingCategory != null ) {
            existingCategory.setPercentage(category.getPercentage());
            categoryRepository.save(existingCategory);
        } else {
            categoryRepository.save(category);
        }
    }

    public void delete(String name) {
        categoryRepository.deleteByCategory(name);
    }

}

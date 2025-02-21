package com.example.PocketPlan.controller;

import com.example.PocketPlan.entity.Amount;
import com.example.PocketPlan.entity.Category;
import com.example.PocketPlan.service.AmountService;
import com.example.PocketPlan.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/categories")
@RestController
@CrossOrigin("*")
public class CategoriesController {
    private CategoryService categoryService;

    public CategoriesController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("")
    public List<Category> getCategories() {
        return categoryService.findAll();
    }

    @PostMapping("")
    public void saveCategory(@RequestBody Category category) {
        System.out.println("A");
        categoryService.save(category);
    }


    @DeleteMapping("{name}")
    public void deleteCategory(@PathVariable("name") String name) {
        categoryService.delete(name);
    }
}

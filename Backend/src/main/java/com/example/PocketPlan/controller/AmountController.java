package com.example.PocketPlan.controller;

import com.example.PocketPlan.entity.Amount;
import com.example.PocketPlan.entity.Category;
import com.example.PocketPlan.service.AmountService;
import com.example.PocketPlan.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/amount")
@RestController
@CrossOrigin("*")
public class AmountController {
    private AmountService amountService;

    public AmountController(AmountService amountService) {
        this.amountService = amountService;
    }

    @PostMapping("")
    public void saveAmount(@RequestBody Amount amount) {
        System.out.println("B");
        amountService.save(amount);
    }

    @GetMapping("")
    public Long getAmount() {
        return amountService.getAmount();
    }

}

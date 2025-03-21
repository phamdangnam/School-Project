package com.example.PocketPlan.controller;

import com.example.PocketPlan.entity.AmountAndDate;
import com.example.PocketPlan.service.AmountAndDateService;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/amount")
@RestController
@CrossOrigin("*")
public class AmountAndDateController {
    private AmountAndDateService amountAndDateService;

    public AmountAndDateController(AmountAndDateService amountAndDateService) {
        this.amountAndDateService = amountAndDateService;
    }

    @PostMapping("")
    public void saveAmountAndDate(@RequestBody AmountAndDate amountAndDate) {
        amountAndDateService.save(amountAndDate);
    }

    @GetMapping("")
    public AmountAndDate getAmountAndDate() {
        return amountAndDateService.getAmountAndDate();
    }

}

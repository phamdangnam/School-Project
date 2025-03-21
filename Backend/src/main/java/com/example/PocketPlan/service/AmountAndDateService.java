package com.example.PocketPlan.service;

import com.example.PocketPlan.entity.AmountAndDate;
import com.example.PocketPlan.repository.AmountAndDateRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AmountAndDateService {
    private AmountAndDateRepository amountAndDateRepository;

    public AmountAndDateService(AmountAndDateRepository amountAndDateRepository) {
        this.amountAndDateRepository = amountAndDateRepository;
    }

    public void save(AmountAndDate amountAndDate) {
        amountAndDateRepository.deleteAll();
        amountAndDateRepository.save(amountAndDate);
    }

    public AmountAndDate getAmountAndDate() {
        Optional<AmountAndDate> data = amountAndDateRepository.findAll().stream().findFirst();
        if (data.isPresent()) return data.get();
        return null;
    }
}

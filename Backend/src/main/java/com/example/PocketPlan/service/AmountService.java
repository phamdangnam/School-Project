package com.example.PocketPlan.service;

import com.example.PocketPlan.entity.Amount;
import com.example.PocketPlan.repository.AmountRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AmountService {
    private AmountRepository amountRepository;

    public AmountService(AmountRepository amountRepository) {
        this.amountRepository = amountRepository;
    }

    public void save(Amount amount) {
        amountRepository.deleteAll();
        amountRepository.save(amount);
    }

    public Long getAmount() {
        Optional<Amount> data = amountRepository.findAll().stream().findFirst();
        if (data.isPresent()) return data.get().getAmount();
        return null;
    }
}

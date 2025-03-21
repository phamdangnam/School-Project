package com.example.PocketPlan.controller;

import com.example.PocketPlan.entity.Transaction;
import com.example.PocketPlan.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RequestMapping("/transactions")
@RestController
@CrossOrigin("*")
public class TransactionsController {
    private TransactionService transactionService;

    public TransactionsController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("{category}")
    public List<Transaction> getTransactions(@PathVariable("category") String category) throws ParseException {
        return transactionService.findByCategory(category);
    }

    @GetMapping("")
    public List<Transaction> getTransactions() {
        return transactionService.findAll();
    }

    @PostMapping("")
    public void saveTransaction(@RequestBody Transaction transaction) {
        transactionService.save(transaction);
    }


    @DeleteMapping("{description}")
    public void deleteTransaction(@PathVariable("description") String description) {
        transactionService.delete(description);
    }
}

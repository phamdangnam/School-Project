package com.example.PocketPlan.service;

import com.example.PocketPlan.entity.Transaction;
import com.example.PocketPlan.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class TransactionService {
    private TransactionRepository transactionRepository;
    private AmountAndDateService amountAndDateService;

    public TransactionService(TransactionRepository transactionRepository, AmountAndDateService amountAndDateService) {
        this.transactionRepository = transactionRepository;
        this.amountAndDateService = amountAndDateService;
    }

    public List<Transaction> findByCategory(String category) throws ParseException {
        List<Transaction> transactions = transactionRepository.findByCategory(category);
        String dateRange = amountAndDateService.getAmountAndDate().getDateRange();
        String[] dates = dateRange.split(" ");
        String startDate = dates[0];
        String endDate = dates[1];
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
        Date start = sdf.parse(startDate);
        Date end = sdf.parse(endDate);
        List<Transaction> filteredTransactions = transactions.stream().filter(transaction -> {
            try {
                Date date = sdf.parse(transaction.getDate());
                return (date.after(start) && date.before(end)) || date.equals(start) || date.equals(end);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }).toList();
        List<Transaction> outOfDateTransactions = transactions.stream()
                .filter(element -> !filteredTransactions.contains(element)).toList();
        transactionRepository.deleteAll(outOfDateTransactions);
        return filteredTransactions;
    }

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public void save(Transaction transaction) {
        transactionRepository.save(transaction);
    }

    public void delete(String description) {
        transactionRepository.deleteById(description);
    }

}

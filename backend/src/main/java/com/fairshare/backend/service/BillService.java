package com.fairshare.backend.service;

import com.fairshare.backend.dsa.dp.FairSplitDP;
import com.fairshare.backend.model.Bill;
import com.fairshare.backend.model.BillSplit;
import com.fairshare.backend.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAll() {
        return billRepository.findAll();
    }

    public Bill create(String title, BigDecimal amount, LocalDate dueDate, String category, Integer splitCount) {
        int n = (splitCount == null || splitCount <= 0) ? 3 : splitCount; // default 3 equal splits
        Bill bill = new Bill(title, amount, dueDate, category);

        var parts = FairSplitDP.split(amount, n);
        bill.getSplits().clear();
        parts.forEach(p -> bill.getSplits().add(new BillSplit(p, false)));

        return billRepository.save(bill);
    }

    public Bill updateStatus(UUID id, String status) {
        Bill b = billRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found"));
        b.setStatus(status);
        // If status marked paid => mark all splits paid
        if ("paid".equalsIgnoreCase(status)) {
            b.getSplits().forEach(s -> s.setPaid(true));
        }
        return billRepository.save(b);
    }

    public void delete(UUID id) {
        billRepository.deleteById(id);
    }
}

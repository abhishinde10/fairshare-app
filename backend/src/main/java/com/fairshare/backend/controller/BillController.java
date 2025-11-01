package com.fairshare.backend.controller;

import com.fairshare.backend.model.Bill;
import com.fairshare.backend.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public List<Bill> getAll() {
        return billService.getAll();
    }

    @PostMapping
    public Bill create(@RequestBody Map<String, Object> data) {
        String title = (String) data.get("title");
        String category = (String) data.get("category");
        BigDecimal amount = new BigDecimal(String.valueOf(data.get("amount")));
        LocalDate dueDate = LocalDate.parse((String) data.get("dueDate"));

        Integer splitCount = null;
        if (data.get("splitCount") != null) {
            splitCount = Integer.parseInt(String.valueOf(data.get("splitCount")));
        }

        return billService.create(title, amount, dueDate, category, splitCount);
    }

    @PutMapping("/{id}")
    public Bill updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "pending");
        return billService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> delete(@PathVariable UUID id) {
        billService.delete(id);
        return Map.of("success", true);
    }
}

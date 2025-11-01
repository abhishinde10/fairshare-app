package com.fairshare.backend.controller;

import com.fairshare.backend.model.Roommate;
import com.fairshare.backend.model.EnergyReading;
import com.fairshare.backend.model.Bill;
import com.fairshare.backend.model.Chore;
import com.fairshare.backend.repository.RoommateRepository;
import com.fairshare.backend.repository.EnergyRepository;
import com.fairshare.backend.repository.BillRepository;
import com.fairshare.backend.repository.ChoreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.*;

/**
 * ✅ Unified Admin Controller
 * Provides:
 *  - Dashboard Overview
 *  - Member Management
 *  - Stats (Bills, Energy, Chores)
 *  - System Activity
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired private RoommateRepository roommateRepository;
    @Autowired private EnergyRepository energyRepository;
    @Autowired private BillRepository billRepository;
    @Autowired private ChoreRepository choreRepository;

    // 🏠 1. Dashboard Overview
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        List<Roommate> roommates = roommateRepository.findAll();
        List<EnergyReading> energyReadings = energyRepository.findAll();
        List<Bill> bills = billRepository.findAll();
        List<Chore> chores = choreRepository.findAll();

        double totalEnergy = energyReadings.stream()
                .mapToDouble(r -> r.getUnits() != null ? r.getUnits() : 0.0)
                .sum();

        double totalBills = bills.stream()
                .mapToDouble(b -> {
                    BigDecimal amt = b.getAmount();
                    return amt != null ? amt.doubleValue() : 0.0;
                })
                .sum();

        long pendingBills = bills.stream()
                .filter(b -> "pending".equalsIgnoreCase(b.getStatus()))
                .count();

        long pendingChores = chores.stream()
                .filter(c -> "pending".equalsIgnoreCase(c.getStatus()))
                .count();

        response.put("householdName", "FairShare++ Household");
        response.put("totalMembers", roommates.size());
        response.put("totalEnergy", totalEnergy);
        response.put("totalBills", totalBills);
        response.put("pendingBills", pendingBills);
        response.put("pendingChores", pendingChores);
        response.put("createdAt", "2025-10-01");
        response.put("members", roommates);

        return ResponseEntity.ok(response);
    }

    // 👥 2. Get Household (basic info)
    @GetMapping("/household")
    public ResponseEntity<Map<String, Object>> getHouseholdOverview() {
        List<Roommate> members = roommateRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("name", "FairShare++ Household");
        response.put("createdAt", "2025-10-01");
        response.put("totalMembers", members.size());
        response.put("members", members);
        return ResponseEntity.ok(response);
    }

    // ➕ 3. Add Member
    @PostMapping("/member")
    public ResponseEntity<Map<String, Object>> addMember(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email is required"));
        }

        Roommate newMember = new Roommate();
        newMember.setName(email.split("@")[0]);
        newMember.setEmail(email);
        roommateRepository.save(newMember);

        return ResponseEntity.ok(Map.of("message", "Member added successfully"));
    }

    // ❌ 4. Delete Member (UUID)
    @DeleteMapping("/member/{id}")
    public ResponseEntity<Map<String, Object>> deleteMember(@PathVariable UUID id) {
        if (!roommateRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Member not found"));
        }
        roommateRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Member deleted successfully"));
    }

    // 🕒 5. Activity Log (static demo)
    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, String>>> getSystemActivity() {
        List<Map<String, String>> activities = new ArrayList<>();
        activities.add(Map.of(
                "event", "Household created",
                "timestamp", "2025-10-01 10:00 AM"
        ));
        activities.add(Map.of(
                "event", "Energy reading updated",
                "timestamp", "2025-10-29 6:30 PM"
        ));
        activities.add(Map.of(
                "event", "Bill payment pending",
                "timestamp", "2025-10-30 4:20 PM"
        ));
        return ResponseEntity.ok(activities);
    }
}

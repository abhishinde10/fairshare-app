package com.fairshare.backend.controller;

import com.fairshare.backend.model.Booking;
import com.fairshare.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ✅ Get all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Create new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            boolean conflict = bookingService.hasConflict(booking);
            if (conflict) {
                return ResponseEntity.status(409)
                        .body(Map.of("error", "Resource already booked for this time slot"));
            }
            Booking saved = bookingService.createBooking(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid booking data", "details", e.getMessage()));
        }
    }

    // ✅ Update booking status or time
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody Booking updated) {
        Optional<Booking> updatedBooking = bookingService.updateBooking(id, updated);
        if (updatedBooking.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Booking not found"));
        }
        return ResponseEntity.ok(updatedBooking.get());
    }

    // ✅ Delete booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Booking deleted successfully"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Booking not found"));
        }
    }
}

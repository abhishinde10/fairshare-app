package com.fairshare.backend.dsa.graph;

import com.fairshare.backend.model.Booking;
import java.time.LocalDateTime;
import java.util.List;

public class GraphColoring {

    // Checks if new booking conflicts with existing ones for same resource
    public static boolean isConflict(List<Booking> existingBookings, LocalDateTime start, LocalDateTime end) {
        for (Booking b : existingBookings) {
            if (b.getStartTime().isBefore(end) && b.getEndTime().isAfter(start)) {
                // Overlap detected
                return true;
            }
        }
        return false;
    }
}

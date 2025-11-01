package com.fairshare.backend.service;

import com.fairshare.backend.model.Booking;
import com.fairshare.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public boolean hasConflict(Booking newBooking) {
        if (newBooking.getResourceId() == null || newBooking.getStartTime() == null || newBooking.getEndTime() == null) {
            return false;
        }

        List<Booking> existingBookings = bookingRepository.findByResourceId(newBooking.getResourceId());

        for (Booking existing : existingBookings) {
            if ("cancelled".equalsIgnoreCase(existing.getStatus())) continue;

            boolean overlap =
                    newBooking.getStartTime().isBefore(existing.getEndTime()) &&
                            newBooking.getEndTime().isAfter(existing.getStartTime());

            if (overlap) return true;
        }
        return false;
    }


    public Booking createBooking(Booking booking) {
        booking.setStatus("pending");
        return bookingRepository.save(booking);
    }

    public Optional<Booking> updateBooking(Long id, Booking updated) {
        return bookingRepository.findById(id).map(existing -> {
            existing.setStartTime(updated.getStartTime());
            existing.setEndTime(updated.getEndTime());
            existing.setStatus(updated.getStatus());
            return bookingRepository.save(existing);
        });
    }

    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

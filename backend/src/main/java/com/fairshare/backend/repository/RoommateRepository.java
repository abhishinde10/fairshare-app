package com.fairshare.backend.repository;

import com.fairshare.backend.model.Roommate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RoommateRepository extends JpaRepository<Roommate, UUID> {
}

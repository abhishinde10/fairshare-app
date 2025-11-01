package com.fairshare.backend.repository;

import com.fairshare.backend.model.RoommateBehavior;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoommateBehaviorRepository extends JpaRepository<RoommateBehavior, UUID> {
    Optional<RoommateBehavior> findByEmail(String email);
}

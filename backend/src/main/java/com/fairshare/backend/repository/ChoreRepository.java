package com.fairshare.backend.repository;

import com.fairshare.backend.model.Chore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChoreRepository extends JpaRepository<Chore, UUID> { }

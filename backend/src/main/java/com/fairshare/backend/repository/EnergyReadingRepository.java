package com.fairshare.backend.repository;

import com.fairshare.backend.model.EnergyReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnergyReadingRepository extends JpaRepository<EnergyReading, Long> {
}

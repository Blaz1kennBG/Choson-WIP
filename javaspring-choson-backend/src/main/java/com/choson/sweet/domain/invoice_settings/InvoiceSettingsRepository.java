package com.choson.sweet.domain.invoice_settings;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceSettingsRepository extends JpaRepository<InvoiceSettings, UUID> {
    Optional<InvoiceSettings> findByCreatorId(UUID creatorId);
}

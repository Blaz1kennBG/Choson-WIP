package com.choson.sweet.domain.invoices;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    Optional<Invoice> findById(UUID id);

    boolean existsById(UUID id);

    List<Invoice> findByClientId(UUID clientId);

    List<Invoice> findByCreatorId(UUID creatorId);
}

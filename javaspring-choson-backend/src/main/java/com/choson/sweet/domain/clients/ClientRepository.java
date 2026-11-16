package com.choson.sweet.domain.clients;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, UUID> {

    Optional<Client> findByName(String name);

    Boolean existsByName(String name);

    Optional<Client> findById(UUID id);

    boolean existsById(UUID id);

    List<Client> findByCreatorId(UUID creatorId);
}

package com.choson.sweet.domain.products;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findById(UUID id);

    boolean existsById(UUID id);

    List<Product> findByCreatorId(UUID creatorId);
}

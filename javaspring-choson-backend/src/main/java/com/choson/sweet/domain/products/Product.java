package com.choson.sweet.domain.products;

import java.util.UUID;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Table(name = "products")
@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;
    public String name;
    public String description;
    public double price;
    @Column(name = "product_number")
    public String productNumber;
    @Column(name = "measure_units")
    public String measureUnits;
    public String createdAt;
    public UUID creatorId;
}

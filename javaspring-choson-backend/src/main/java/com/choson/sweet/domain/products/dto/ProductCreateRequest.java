package com.choson.sweet.domain.products.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Positive;

public class ProductCreateRequest {
    public String name;
    public String description;
    @Positive
    public double price;
    @JsonProperty("product_number")
    public String productNumber;
    @JsonProperty("measure_units")
    public String measureUnits;
}

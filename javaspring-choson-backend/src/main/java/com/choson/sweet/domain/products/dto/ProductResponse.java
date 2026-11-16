package com.choson.sweet.domain.products.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;

import com.choson.sweet.domain.products.Product;

import lombok.Data;

@Data
public class ProductResponse {
    public UUID id;
    public String name;
    public String description;
    public double price;
    @JsonProperty("product_number")
    public String productNumber;
    @JsonProperty("measure_units")
    public String measureUnits;
    public String createdAt;
    public UUID creatorId;

    public ProductResponse(Product product) {
        BeanUtils.copyProperties(product, this);
    }
}

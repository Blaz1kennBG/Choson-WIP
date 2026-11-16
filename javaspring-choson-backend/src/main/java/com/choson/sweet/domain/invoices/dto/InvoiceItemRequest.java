package com.choson.sweet.domain.invoices.dto;

import java.util.UUID;

import jakarta.validation.constraints.Positive;

public class InvoiceItemRequest {
    public UUID productId;
    @Positive
    public double quantity;
    public double unitPrice;
}

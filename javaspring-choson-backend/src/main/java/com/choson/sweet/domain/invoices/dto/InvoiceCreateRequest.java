package com.choson.sweet.domain.invoices.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InvoiceCreateRequest {
    public UUID clientId;
    @Valid
    public List<InvoiceItemRequest> items;
    @JsonProperty("payment_type")
    public String paymentType;
    @JsonProperty("bank")
    public String bank;
    @JsonProperty("bic")
    public String bic;
    @JsonProperty("iban")
    public String iban;
    @JsonProperty("due_date")
    public String dueDate;
}

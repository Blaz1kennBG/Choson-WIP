package com.choson.sweet.domain.invoices.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonProperty;

public class InvoiceUpdateRequest {
    public UUID clientId;
    // public String status; // TODO: statuses
    @Valid
    public List<InvoiceItemRequest> items;
    public boolean itemsPresent;
    public boolean clientIdPresent;
    // public boolean statusPresent; // TODO: statuses
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
    public boolean paymentTypePresent;
    public boolean bankPresent;
    public boolean bicPresent;
    public boolean ibanPresent;
    public boolean dueDatePresent;

    public InvoiceUpdateRequest() {
        this.clientIdPresent = false;
        // this.statusPresent = false; // TODO: statuses
        this.itemsPresent = false;
        this.paymentTypePresent = false;
        this.bankPresent = false;
        this.bicPresent = false;
        this.ibanPresent = false;
        this.dueDatePresent = false;
    }
}

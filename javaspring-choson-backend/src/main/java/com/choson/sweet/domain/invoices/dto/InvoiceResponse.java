package com.choson.sweet.domain.invoices.dto;

import java.util.List;
import java.util.UUID;

import com.choson.sweet.domain.invoices.Invoice;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class InvoiceResponse {
    public UUID id;
    public String invoiceNumber;
    public UUID clientId;
    public double total;
    public String status;
    public String createdAt;
    public UUID creatorId;
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
    public List<InvoiceItemResponse> items;

    public InvoiceResponse(Invoice invoice) {
        this.id = invoice.id;
        this.invoiceNumber = invoice.invoiceNumber;
        this.clientId = invoice.clientId;
        this.total = invoice.total;
        this.status = invoice.status;
        this.createdAt = invoice.createdAt;
        this.creatorId = invoice.creatorId;
        this.paymentType = invoice.paymentType;
        this.bank = invoice.bank;
        this.bic = invoice.bic;
        this.iban = invoice.iban;
        this.dueDate = invoice.dueDate;
        this.items = invoice.items.stream()
                .map(InvoiceItemResponse::new)
                .toList();
    }
}

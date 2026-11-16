package com.choson.sweet.domain.invoices.dto;

import java.util.UUID;

import com.choson.sweet.domain.invoices.InvoiceItem;

import lombok.Data;

@Data
public class InvoiceItemResponse {
    public UUID id;
    public UUID productId;
    public String productName;
    @com.fasterxml.jackson.annotation.JsonProperty("measure_units")
    public String measureUnits;
    public double quantity;
    public double unitPrice;
    public double lineTotal;

    public InvoiceItemResponse(InvoiceItem item) {
        this.id = item.id;
        this.productId = item.productId;
        this.productName = item.productName;
        this.measureUnits = item.measureUnits;
        this.quantity = item.quantity;
        this.unitPrice = item.unitPrice;
        this.lineTotal = item.getLineTotal();
    }
}

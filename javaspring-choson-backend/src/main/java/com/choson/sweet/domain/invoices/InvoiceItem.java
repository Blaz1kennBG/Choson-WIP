package com.choson.sweet.domain.invoices;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Table(name = "invoice_items")
@Entity
@Data
public class InvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    public Invoice invoice;

    public UUID productId;
    public String productName;
    @Column(name = "measure_units")
    public String measureUnits;
    public double quantity;
    public double unitPrice;

    public double getLineTotal() {
        return quantity * unitPrice;
    }
}

package com.choson.sweet.domain.invoices;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Table(name = "invoices")
@Entity
@Data
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;
    public String invoiceNumber;
    public UUID clientId;
    public double total;
    public String status;
    public String createdAt;
    public UUID creatorId;
    @Column(name = "payment_type")
    public String paymentType;
    @Column(name = "bank")
    public String bank;
    @Column(name = "bic")
    public String bic;
    @Column(name = "iban")
    public String iban;
    @Column(name = "due_date")
    public String dueDate;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    public List<InvoiceItem> items = new ArrayList<>();
}

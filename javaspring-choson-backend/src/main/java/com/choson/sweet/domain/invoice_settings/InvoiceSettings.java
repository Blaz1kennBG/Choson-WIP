package com.choson.sweet.domain.invoice_settings;

import java.util.UUID;

import jakarta.persistence.*;
import lombok.Data;

@Table(name = "invoice_settings")
@Data
@Entity
public class InvoiceSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;
    public String name;
    public String address;
    public String phone;
    @Column(name = "materially_responsible_person")
    public String materiallyResponsiblePerson;
    @Column(name = "company_registration_number")
    public String companyRegistrationNumber;
    @Column(name = "vat_number")
    public String vatNumber;
    @Column(unique = true)
    public UUID creatorId;
}

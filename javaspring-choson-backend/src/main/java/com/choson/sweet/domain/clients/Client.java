package com.choson.sweet.domain.clients;

import java.util.UUID;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Table(name = "clients")
@Data
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;
    public String name;
    public String email;
    public String address;
    public String phone;
    @Column(name = "materially_responsible_person")
    public String materiallyResponsiblePerson;
    @Column(name = "company_registration_number")
    public String companyRegistrationNumber;
    @Column(name = "vat_number")
    public String vatNumber;
    @Column(name = "tax_rate")
    public Double taxRate;
    @Column(name = "bank")
    public String bank;
    @Column(name = "bic")
    public String bic;
    @Column(name = "iban")
    public String iban;
    public String createdAt;

    public UUID creatorId;

}

package com.choson.sweet.domain.clients.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;

public class ClientCreateRequest {
    public String name;
    @Email
    public String email;
    public String address;
    public String phone;
    @JsonProperty("materially_responsible_person")
    public String materiallyResponsiblePerson;
    @JsonProperty("company_registration_number")
    public String companyRegistrationNumber;
    @JsonProperty("vat_number")
    public String vatNumber;
    @JsonProperty("tax_rate")
    public Double taxRate;
    @JsonProperty("bank")
    public String bank;
    @JsonProperty("bic")
    public String bic;
    @JsonProperty("iban")
    public String iban;
}

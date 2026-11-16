package com.choson.sweet.domain.clients.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;

import com.choson.sweet.domain.clients.Client;

import lombok.Data;

@Data
public class ClientResponse {
    public UUID id;
    public String name;
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
    public String createdAt;
    public UUID creatorId;

    public ClientResponse(Client client) {
        BeanUtils.copyProperties(client, this);
    }
}

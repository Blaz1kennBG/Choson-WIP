package com.choson.sweet.domain.invoice_settings.dto;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.BeanUtils;

import com.choson.sweet.domain.invoice_settings.InvoiceSettings;

import lombok.Data;

@Data
public class InvoiceSettingsResponse {
    public UUID id;
    public String name;
    public String address;
    public String phone;
    @JsonProperty("materially_responsible_person")
    public String materiallyResponsiblePerson;
    @JsonProperty("company_registration_number")
    public String companyRegistrationNumber;
    @JsonProperty("vat_number")
    public String vatNumber;
    public UUID creatorId;

    public InvoiceSettingsResponse(InvoiceSettings settings) {
        BeanUtils.copyProperties(settings, this);
    }
}

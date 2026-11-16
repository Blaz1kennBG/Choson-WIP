package com.choson.sweet.domain.invoice_settings.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class InvoiceSettingsUpdateRequest {
    public String name;
    public String address;
    public String phone;
    @JsonProperty("materially_responsible_person")
    public String materiallyResponsiblePerson;
    @JsonProperty("company_registration_number")
    public String companyRegistrationNumber;
    @JsonProperty("vat_number")
    public String vatNumber;
}

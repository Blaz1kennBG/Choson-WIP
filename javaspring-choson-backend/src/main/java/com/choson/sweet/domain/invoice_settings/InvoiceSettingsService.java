package com.choson.sweet.domain.invoice_settings;

import java.util.UUID;

import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsResponse;
import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsUpdateRequest;

public interface InvoiceSettingsService {
    InvoiceSettingsResponse getByCreatorId(UUID creatorId);
    InvoiceSettingsResponse update(UUID creatorId, InvoiceSettingsUpdateRequest request);
}

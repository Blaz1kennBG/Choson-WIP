package com.choson.sweet.domain.invoice_settings;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsResponse;
import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsUpdateRequest;

@Service
public class InvoiceSettingsServiceImpl implements InvoiceSettingsService {

    private final InvoiceSettingsRepository repository;

    public InvoiceSettingsServiceImpl(InvoiceSettingsRepository repository) {
        this.repository = repository;
    }

    @Override
    public InvoiceSettingsResponse getByCreatorId(UUID creatorId) {
        Optional<InvoiceSettings> existing = repository.findByCreatorId(creatorId);
        if (existing.isEmpty()) {
            InvoiceSettings empty = new InvoiceSettings();
            empty.creatorId = creatorId;
            repository.save(empty);
            return new InvoiceSettingsResponse(empty);
        }
        return new InvoiceSettingsResponse(existing.get());
    }

    @Override
    public InvoiceSettingsResponse update(UUID creatorId, InvoiceSettingsUpdateRequest request) {
        InvoiceSettings settings = repository.findByCreatorId(creatorId)
                .orElseGet(() -> {
                    InvoiceSettings s = new InvoiceSettings();
                    s.creatorId = creatorId;
                    return s;
                });

        settings.name = request.name;
        settings.address = request.address;
        settings.phone = request.phone;
        settings.materiallyResponsiblePerson = request.materiallyResponsiblePerson;
        settings.companyRegistrationNumber = request.companyRegistrationNumber;
        settings.vatNumber = request.vatNumber;
        repository.save(settings);
        return new InvoiceSettingsResponse(settings);
    }
}

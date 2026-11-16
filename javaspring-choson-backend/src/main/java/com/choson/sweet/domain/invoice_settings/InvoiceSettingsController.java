package com.choson.sweet.domain.invoice_settings;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsResponse;
import com.choson.sweet.domain.invoice_settings.dto.InvoiceSettingsUpdateRequest;
import com.choson.sweet.shared.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/invoice-settings")
public class InvoiceSettingsController {

    private final InvoiceSettingsService service;

    public InvoiceSettingsController(InvoiceSettingsService service) {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<InvoiceSettingsResponse>> getSettings(
            HttpServletRequest servletRequest) {
        UUID userId = (UUID) servletRequest.getAttribute("userId");
        InvoiceSettingsResponse settings = service.getByCreatorId(userId);
        return ResponseEntity.ok(new ApiResponse<>("Settings retrieved successfully", settings));
    }

    @PutMapping("")
    public ResponseEntity<ApiResponse<InvoiceSettingsResponse>> updateSettings(
            @RequestBody InvoiceSettingsUpdateRequest request,
            HttpServletRequest servletRequest) {
        UUID userId = (UUID) servletRequest.getAttribute("userId");
        InvoiceSettingsResponse settings = service.update(userId, request);
        return ResponseEntity.ok(new ApiResponse<>("Settings updated successfully", settings));
    }
}

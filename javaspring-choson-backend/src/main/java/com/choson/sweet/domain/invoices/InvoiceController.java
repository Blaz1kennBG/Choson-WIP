package com.choson.sweet.domain.invoices;

import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.choson.sweet.domain.invoices.dto.InvoiceCreateRequest;
import com.choson.sweet.domain.invoices.dto.InvoiceResponse;
import com.choson.sweet.domain.invoices.dto.InvoiceUpdateRequest;
import com.choson.sweet.shared.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(
            @Valid @RequestBody InvoiceCreateRequest request,
            HttpServletRequest servletRequest) {
        UUID userId = (UUID) servletRequest.getAttribute("userId");
        InvoiceResponse invoice = invoiceService.createInvoice(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Invoice created successfully", invoice));
    }

    @GetMapping("/{invoiceId}")
    @ResponseBody
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable("invoiceId") UUID invoiceId) {
        InvoiceResponse invoice = invoiceService.getInvoiceById(invoiceId);
        return ResponseEntity.ok(new ApiResponse<>("Invoice retrieved successfully", invoice));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<InvoiceResponse>>> getAllInvoices(HttpServletRequest servletRequest) {
        UUID creatorId = (UUID) servletRequest.getAttribute("userId");
        Iterable<InvoiceResponse> invoices = invoiceService.getAllByCreatorId(creatorId);
        return ResponseEntity.ok(new ApiResponse<>("Invoices retrieved successfully", invoices));
    }

    @PutMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoice(
            @PathVariable("invoiceId") UUID invoiceId,
            @Valid @RequestBody InvoiceUpdateRequest request) {
        InvoiceResponse invoice = invoiceService.updateInvoice(invoiceId, request);
        return ResponseEntity.ok(new ApiResponse<>("Invoice updated successfully", invoice));
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable("invoiceId") UUID invoiceId) {
        invoiceService.deleteInvoice(invoiceId);
        return ResponseEntity.ok(new ApiResponse<>("Invoice deleted successfully", null));
    }

    @GetMapping("/{invoiceId}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable("invoiceId") UUID invoiceId) {
        byte[] pdfBytes = invoiceService.generatePdf(invoiceId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + invoiceId + ".pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}

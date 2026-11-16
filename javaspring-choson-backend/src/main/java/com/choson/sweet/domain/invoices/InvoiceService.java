package com.choson.sweet.domain.invoices;

import java.util.List;
import java.util.UUID;

import com.choson.sweet.domain.invoices.dto.InvoiceCreateRequest;
import com.choson.sweet.domain.invoices.dto.InvoiceDeleteResponse;
import com.choson.sweet.domain.invoices.dto.InvoiceResponse;
import com.choson.sweet.domain.invoices.dto.InvoiceUpdateRequest;

public interface InvoiceService {

    InvoiceResponse createInvoice(InvoiceCreateRequest request, UUID creatorId);

    InvoiceResponse getInvoiceById(UUID id);

    InvoiceDeleteResponse deleteInvoice(UUID id);

    InvoiceResponse updateInvoice(UUID id, InvoiceUpdateRequest request);

    Iterable<InvoiceResponse> getAllInvoices();

    List<InvoiceResponse> getAllByCreatorId(UUID creatorId);

    void nullifyClientId(UUID clientId);

    byte[] generatePdf(UUID invoiceId);
}

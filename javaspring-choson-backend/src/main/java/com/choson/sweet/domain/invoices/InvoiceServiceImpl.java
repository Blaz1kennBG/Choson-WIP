package com.choson.sweet.domain.invoices;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.choson.sweet.domain.invoices.dto.InvoiceCreateRequest;
import com.choson.sweet.domain.invoices.dto.InvoiceDeleteResponse;
import com.choson.sweet.domain.invoices.dto.InvoiceItemRequest;
import com.choson.sweet.domain.invoices.dto.InvoiceResponse;
import com.choson.sweet.domain.invoices.dto.InvoiceUpdateRequest;
import com.choson.sweet.domain.clients.Client;
import com.choson.sweet.domain.clients.ClientRepository;
import com.choson.sweet.domain.invoice_settings.InvoiceSettings;
import com.choson.sweet.domain.invoice_settings.InvoiceSettingsRepository;
import com.choson.sweet.domain.products.Product;
import com.choson.sweet.domain.products.ProductRepository;
import com.choson.sweet.shared.PdfGenerationService;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;
    private final InvoiceSettingsRepository invoiceSettingsRepository;
    private final PdfGenerationService pdfGenerationService;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository,
                              ProductRepository productRepository,
                              ClientRepository clientRepository,
                              InvoiceSettingsRepository invoiceSettingsRepository,
                              PdfGenerationService pdfGenerationService) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.clientRepository = clientRepository;
        this.invoiceSettingsRepository = invoiceSettingsRepository;
        this.pdfGenerationService = pdfGenerationService;
    }

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceCreateRequest request, UUID creatorId) {
        Invoice invoice = new Invoice();
        invoice.invoiceNumber = "INV-" + java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        invoice.clientId = request.clientId;
        invoice.status = "pending";
        invoice.creatorId = creatorId;
        invoice.createdAt = java.time.LocalDateTime.now().toString();
        invoice.paymentType = request.paymentType != null ? request.paymentType : "bank_transfer";
        invoice.bank = request.bank;
        invoice.bic = request.bic;
        invoice.iban = request.iban;
        invoice.dueDate = request.dueDate != null ? request.dueDate
                : java.time.LocalDateTime.now().plusDays(14).format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        if (request.items == null || request.items.isEmpty()) {
            throw new RuntimeException("Invoice must have at least one item");
        }

        double computedTotal = 0;
        for (InvoiceItemRequest itemReq : request.items) {
            InvoiceItem item = new InvoiceItem();
            item.invoice = invoice;
            item.productId = itemReq.productId;
            item.quantity = itemReq.quantity;
            item.unitPrice = itemReq.unitPrice;

            Optional<Product> product = productRepository.findById(itemReq.productId);
            if (product.isPresent()) {
                item.productName = product.get().name;
                item.measureUnits = product.get().measureUnits != null ? product.get().measureUnits : "бр.";
            } else {
                item.productName = "Unknown Product";
                item.measureUnits = "бр.";
            }

            invoice.items.add(item);
            computedTotal += item.getLineTotal();
        }

        invoice.total = computedTotal;
        invoiceRepository.save(invoice);
        return new InvoiceResponse(invoice);
    }

    @Override
    public InvoiceResponse getInvoiceById(UUID id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if (invoice == null || invoice.isEmpty()) {
            throw new RuntimeException("Invoice not found");
        }
        return new InvoiceResponse(invoice.get());
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoice(UUID id, InvoiceUpdateRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (request.clientIdPresent) {
            invoice.clientId = request.clientId;
        }
        // if (request.statusPresent && request.status != null) { // TODO: statuses
        //     invoice.status = request.status;
        // }

        if (request.paymentTypePresent) {
            invoice.paymentType = request.paymentType;
        }
        if (request.bankPresent) {
            invoice.bank = request.bank;
        }
        if (request.bicPresent) {
            invoice.bic = request.bic;
        }
        if (request.ibanPresent) {
            invoice.iban = request.iban;
        }
        if (request.dueDatePresent) {
            invoice.dueDate = request.dueDate;
        }

        if (request.itemsPresent && request.items != null) {
            invoice.items.clear();

            double computedTotal = 0;
            for (InvoiceItemRequest itemReq : request.items) {
                InvoiceItem item = new InvoiceItem();
                item.invoice = invoice;
                item.productId = itemReq.productId;
                item.quantity = itemReq.quantity;
                item.unitPrice = itemReq.unitPrice;

                Optional<Product> product = productRepository.findById(itemReq.productId);
                item.productName = product.map(p -> p.name).orElse("Unknown Product");
                item.measureUnits = product.map(p -> p.measureUnits).orElse("бр.");

                invoice.items.add(item);
                computedTotal += item.getLineTotal();
            }

            invoice.total = computedTotal;
        }

        invoiceRepository.save(invoice);
        return new InvoiceResponse(invoice);
    }

    @Override
    @Transactional
    public InvoiceDeleteResponse deleteInvoice(UUID id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoiceRepository.delete(invoice);
        return new InvoiceDeleteResponse();
    }

    @Override
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(InvoiceResponse::new)
                .toList();
    }

    @Override
    public List<InvoiceResponse> getAllByCreatorId(UUID creatorId) {
        return invoiceRepository.findByCreatorId(creatorId).stream()
                .map(InvoiceResponse::new)
                .toList();
    }

    @Override
    @Transactional
    public void nullifyClientId(UUID clientId) {
        List<Invoice> invoices = invoiceRepository.findByClientId(clientId);
        for (Invoice invoice : invoices) {
            invoice.clientId = null;
            invoiceRepository.save(invoice);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePdf(UUID invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Client client = null;
        if (invoice.clientId != null) {
            var clientOpt = clientRepository.findById(invoice.clientId);
            if (clientOpt.isPresent()) {
                client = clientOpt.get();
            }
        }

        InvoiceSettings settings = invoiceSettingsRepository.findByCreatorId(invoice.creatorId).orElse(null);

        return pdfGenerationService.generateInvoicePdf(invoice, client, settings);
    }
}

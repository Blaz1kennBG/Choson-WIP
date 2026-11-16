package com.choson.sweet.domain.clients;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.choson.sweet.domain.clients.dto.ClientCreateRequest;
import com.choson.sweet.domain.clients.dto.ClientDeleteResponse;
import com.choson.sweet.domain.clients.dto.ClientResponse;
import com.choson.sweet.domain.clients.dto.ClientUpdateRequest;
import com.choson.sweet.domain.invoices.InvoiceService;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final InvoiceService invoiceService;

    public ClientServiceImpl(ClientRepository clientRepository, InvoiceService invoiceService) {
        this.clientRepository = clientRepository;
        this.invoiceService = invoiceService;
    }

    @Override
    public ClientResponse createClient(ClientCreateRequest request, UUID creatorId) {
        Client client = new Client();
        client.name = request.name;
        client.email = request.email;
        client.address = request.address;
        client.phone = request.phone;
        client.materiallyResponsiblePerson = request.materiallyResponsiblePerson;
        client.companyRegistrationNumber = request.companyRegistrationNumber;
        client.vatNumber = request.vatNumber;
        client.taxRate = request.taxRate != null ? request.taxRate : 20.0;
        client.bank = request.bank;
        client.bic = request.bic;
        client.iban = request.iban;
        client.creatorId = creatorId;
        client.createdAt = java.time.LocalDateTime.now().toString();
        if (client.name == null || client.name.isEmpty()) {
            throw new RuntimeException("Client name cannot be empty");
        }
        if (client.name.length() < 3) {
            throw new RuntimeException("Client name must be at least 3 characters long");
        }
        clientRepository.save(client);
        return new ClientResponse(client);

    }

    @Override
    public ClientResponse getClientById(UUID id) {
        Optional<Client> client = clientRepository.findById(id);
        if (client == null || client.isEmpty()) {
            throw new RuntimeException("Client not found");
        }
        return new ClientResponse(client.get());
    }

    @Override
    public ClientResponse updateClient(UUID id, ClientUpdateRequest request) {
        Optional<Client> client = clientRepository.findById(id);
        if (client == null || client.isEmpty()) {
            throw new RuntimeException("Client not found");
        }

        client.get().name = request.name;
        client.get().email = request.email;
        client.get().address = request.address;
        client.get().phone = request.phone;
        client.get().materiallyResponsiblePerson = request.materiallyResponsiblePerson;
        client.get().companyRegistrationNumber = request.companyRegistrationNumber;
        client.get().vatNumber = request.vatNumber;
        client.get().taxRate = request.taxRate;
        client.get().bank = request.bank;
        client.get().bic = request.bic;
        client.get().iban = request.iban;
        if (client.get().name == null || client.get().name.isEmpty()) {
            throw new RuntimeException("Client name cannot be empty");
        }
        if (client.get().name.length() < 3) {
            throw new RuntimeException("Client name must be at least 3 characters long");
        }
        clientRepository.save(client.get());
        return new ClientResponse(client.get());
    }

    @Override
    public ClientDeleteResponse deleteClient(UUID id) {
        Optional<Client> client = clientRepository.findById(id);
        if (client == null || client.isEmpty()) {
            throw new RuntimeException("Client not found");
        }
        invoiceService.nullifyClientId(id);
        clientRepository.delete(client.get());
        return new ClientDeleteResponse();
    }

    @Override
    public List<ClientResponse> getAllClients() {

        return clientRepository.findAll().stream()
                .map(c -> new ClientResponse(c))
                .toList();
    }

    @Override
    public List<ClientResponse> getAllByCreatorId(UUID creatorId) {
        return clientRepository.findByCreatorId(creatorId).stream()
                .map(c -> new ClientResponse(c))
                .toList();
    }

}

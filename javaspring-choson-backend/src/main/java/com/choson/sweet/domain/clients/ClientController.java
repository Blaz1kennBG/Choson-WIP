
package com.choson.sweet.domain.clients;

import java.util.UUID;

import org.springframework.http.HttpStatus;
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

import com.choson.sweet.domain.clients.dto.ClientCreateRequest;
import com.choson.sweet.domain.clients.dto.ClientResponse;
import com.choson.sweet.domain.clients.dto.ClientUpdateRequest;
import com.choson.sweet.shared.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<ClientResponse>> createClient(
            @Valid @RequestBody ClientCreateRequest request,
            HttpServletRequest servletRequest) {
        UUID userId = (UUID) servletRequest.getAttribute("userId");
        ClientResponse client = clientService.createClient(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Client created successfully", client));
    }

    @GetMapping("/{clientId}")
    @ResponseBody
    public ResponseEntity<ApiResponse<ClientResponse>> getClientById(@PathVariable("clientId") UUID clientId) {
        System.out.println("Received request to get client with ID: " + clientId);
        ClientResponse client = clientService.getClientById(clientId);
        return ResponseEntity.ok(new ApiResponse<>("Client retrieved successfully", client));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<ClientResponse>>> getAllClients(HttpServletRequest servletRequest) {
        UUID creatorId = (UUID) servletRequest.getAttribute("userId");
        Iterable<ClientResponse> clients = clientService.getAllByCreatorId(creatorId);
        return ResponseEntity.ok(new ApiResponse<>("Clients retrieved successfully", clients));
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ApiResponse<ClientResponse>> updateClient(
            @PathVariable("clientId") UUID clientId,
            @Valid @RequestBody ClientUpdateRequest request) {
        ClientResponse client = clientService.updateClient(clientId, request);
        return ResponseEntity.ok(new ApiResponse<>("Client updated successfully", client));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable("clientId") UUID clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.ok(new ApiResponse<>("Client deleted successfully", null));
    }
}
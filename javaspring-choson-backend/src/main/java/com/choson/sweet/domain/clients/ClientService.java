package com.choson.sweet.domain.clients;

import java.util.List;
import java.util.UUID;

import com.choson.sweet.domain.clients.dto.ClientCreateRequest;
import com.choson.sweet.domain.clients.dto.ClientDeleteResponse;
import com.choson.sweet.domain.clients.dto.ClientResponse;
import com.choson.sweet.domain.clients.dto.ClientUpdateRequest;

public interface ClientService {

    ClientResponse createClient(ClientCreateRequest request, UUID creatorId);

    ClientResponse getClientById(UUID id);

    ClientDeleteResponse deleteClient(UUID id);

    ClientResponse updateClient(UUID id, ClientUpdateRequest request);

    Iterable<ClientResponse> getAllClients();

    List<ClientResponse> getAllByCreatorId(UUID creatorId);
}

package com.choson.sweet.domain.products;

import java.util.List;
import java.util.UUID;

import com.choson.sweet.domain.products.dto.ProductCreateRequest;
import com.choson.sweet.domain.products.dto.ProductDeleteResponse;
import com.choson.sweet.domain.products.dto.ProductResponse;
import com.choson.sweet.domain.products.dto.ProductUpdateRequest;

public interface ProductService {

    ProductResponse createProduct(ProductCreateRequest request, UUID creatorId);

    ProductResponse getProductById(UUID id);

    ProductDeleteResponse deleteProduct(UUID id);

    ProductResponse updateProduct(UUID id, ProductUpdateRequest request);

    Iterable<ProductResponse> getAllProducts();

    List<ProductResponse> getAllByCreatorId(UUID creatorId);
}

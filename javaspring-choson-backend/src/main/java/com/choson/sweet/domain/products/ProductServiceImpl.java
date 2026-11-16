package com.choson.sweet.domain.products;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.choson.sweet.domain.products.dto.ProductCreateRequest;
import com.choson.sweet.domain.products.dto.ProductDeleteResponse;
import com.choson.sweet.domain.products.dto.ProductResponse;
import com.choson.sweet.domain.products.dto.ProductUpdateRequest;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse createProduct(ProductCreateRequest request, UUID creatorId) {
        Product product = new Product();
        product.name = request.name;
        product.description = request.description;
        product.price = request.price;
        product.productNumber = request.productNumber;
        product.measureUnits = request.measureUnits != null ? request.measureUnits : "бр.";
        product.creatorId = creatorId;
        product.createdAt = java.time.LocalDateTime.now().toString();
        if (product.name == null || product.name.isEmpty()) {
            throw new RuntimeException("Product name cannot be empty");
        }
        if (product.name.length() < 3) {
            throw new RuntimeException("Product name must be at least 3 characters long");
        }
        if (product.price <= 0) {
            throw new RuntimeException("Product price must be greater than zero");
        }
        productRepository.save(product);
        return new ProductResponse(product);
    }

    @Override
    public ProductResponse getProductById(UUID id) {
        Optional<Product> product = productRepository.findById(id);
        if (product == null || product.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        return new ProductResponse(product.get());
    }

    @Override
    public ProductResponse updateProduct(UUID id, ProductUpdateRequest request) {
        Optional<Product> product = productRepository.findById(id);
        if (product == null || product.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        product.get().name = request.name;
        product.get().description = request.description;
        product.get().price = request.price;
        product.get().productNumber = request.productNumber;
        product.get().measureUnits = request.measureUnits;
        if (product.get().name == null || product.get().name.isEmpty()) {
            throw new RuntimeException("Product name cannot be empty");
        }
        if (product.get().name.length() < 3) {
            throw new RuntimeException("Product name must be at least 3 characters long");
        }
        if (product.get().price <= 0) {
            throw new RuntimeException("Product price must be greater than zero");
        }
        productRepository.save(product.get());
        return new ProductResponse(product.get());
    }

    @Override
    public ProductDeleteResponse deleteProduct(UUID id) {
        Optional<Product> product = productRepository.findById(id);
        if (product == null || product.isEmpty()) {
            throw new RuntimeException("Product not found");
        }
        productRepository.delete(product.get());
        return new ProductDeleteResponse();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(p -> new ProductResponse(p))
                .toList();
    }

    @Override
    public List<ProductResponse> getAllByCreatorId(UUID creatorId) {
        return productRepository.findByCreatorId(creatorId).stream()
                .map(p -> new ProductResponse(p))
                .toList();
    }
}

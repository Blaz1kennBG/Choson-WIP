package com.choson.sweet.domain.products;

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

import com.choson.sweet.domain.products.dto.ProductCreateRequest;
import com.choson.sweet.domain.products.dto.ProductResponse;
import com.choson.sweet.domain.products.dto.ProductUpdateRequest;
import com.choson.sweet.shared.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductCreateRequest request,
            HttpServletRequest servletRequest) {
        UUID userId = (UUID) servletRequest.getAttribute("userId");
        ProductResponse product = productService.createProduct(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Product created successfully", product));
    }

    @GetMapping("/{productId}")
    @ResponseBody
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable("productId") UUID productId) {
        ProductResponse product = productService.getProductById(productId);
        return ResponseEntity.ok(new ApiResponse<>("Product retrieved successfully", product));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<ProductResponse>>> getAllProducts(HttpServletRequest servletRequest) {
        UUID creatorId = (UUID) servletRequest.getAttribute("userId");
        Iterable<ProductResponse> products = productService.getAllByCreatorId(creatorId);
        return ResponseEntity.ok(new ApiResponse<>("Products retrieved successfully", products));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable("productId") UUID productId,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse product = productService.updateProduct(productId, request);
        return ResponseEntity.ok(new ApiResponse<>("Product updated successfully", product));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable("productId") UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok(new ApiResponse<>("Product deleted successfully", null));
    }
}

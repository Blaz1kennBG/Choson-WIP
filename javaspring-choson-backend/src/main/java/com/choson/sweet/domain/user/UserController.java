package com.choson.sweet.domain.user;

import com.choson.sweet.domain.user.dto.LoginRequest;
import com.choson.sweet.domain.user.dto.LoginTokens;
import com.choson.sweet.domain.user.dto.RegisterRequest;
import com.choson.sweet.domain.user.dto.UserResponse;
import com.choson.sweet.shared.ApiResponse;
import com.choson.sweet.shared.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public UserController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("User registered successfully", user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(HttpServletRequest request) {
        UUID userId = (UUID) request.getAttribute("userId");
        UserResponse user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(new ApiResponse<>("Current user", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        clearCookie(response, "access_token", "/");
        clearCookie(response, "refresh_token", "/api/auth/refresh");
        return ResponseEntity.ok(new ApiResponse<>("Logged out", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {

        // 1. Verify credentials — returns user only
        UserResponse user = authService.login(request);

        // 2. Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.id, user.name);
        String refreshToken = jwtUtil.generateRefreshToken(user.id);

        // 3. Store refresh in DB
        authService.saveRefreshToken(user.id, refreshToken);

        // 4. Set HttpOnly cookies
        setCookie(response, "access_token", accessToken, 900, "/");
        setCookie(response, "refresh_token", refreshToken, 604800, "/api/auth/refresh");

        return ResponseEntity.ok(new ApiResponse<>("Login successful", user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        String refreshToken = extractCookie(request, "refresh_token");
        if (refreshToken == null) {
            throw new RuntimeException("No refresh token provided");
        }

        LoginTokens tokens = authService.refresh(refreshToken);

        setCookie(response, "access_token", tokens.accessToken, 900, "/");
        setCookie(response, "refresh_token", tokens.refreshToken, 604800, "/api/auth/refresh");

        return ResponseEntity.ok(new ApiResponse<>("Token refreshed", null));
    }

    // Helpers
    private void setCookie(HttpServletResponse res, String name, String value, int maxAge, String path) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production with HTTPS
        cookie.setPath(path);
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "Strict");
        res.addCookie(cookie);
    }

    private void clearCookie(HttpServletResponse res, String name, String path) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setPath(path);
        cookie.setMaxAge(0);
        res.addCookie(cookie);
    }

    private String extractCookie(HttpServletRequest req, String name) {
        if (req.getCookies() == null)
            return null;
        return Arrays.stream(req.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst().orElse(null);
    }
}

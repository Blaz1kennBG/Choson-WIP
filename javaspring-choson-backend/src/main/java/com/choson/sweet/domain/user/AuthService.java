package com.choson.sweet.domain.user;

import java.util.UUID;

import com.choson.sweet.domain.user.dto.LoginRequest;
import com.choson.sweet.domain.user.dto.LoginTokens;
import com.choson.sweet.domain.user.dto.RegisterRequest;
import com.choson.sweet.domain.user.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);

    UserResponse login(LoginRequest request);

    LoginTokens refresh(String refreshToken);

    void saveRefreshToken(UUID userId, String refreshToken);

    UserResponse getCurrentUser(UUID userId);
}

package com.choson.sweet.domain.user;

import java.util.Optional;
import java.util.UUID;

import com.choson.sweet.domain.user.dto.LoginRequest;
import com.choson.sweet.domain.user.dto.LoginTokens;
import com.choson.sweet.domain.user.dto.RegisterRequest;
import com.choson.sweet.domain.user.dto.UserResponse;
import com.choson.sweet.shared.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByName(request.name)) {
            throw new RuntimeException("Name already in use");
        }
        User user = new User();
        user.name = request.name;
        user.email = request.email;
        user.setHashedPassword(hashPassword(request.password));
        userRepository.save(user);
        return new UserResponse(user.id, user.name, user.email);
    }

    @Override
    public UserResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByName(request.name);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOptional.get();
        if (!checkPassword(request.password, user.getHashedPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return new UserResponse(user.id, user.name, user.email);
    }

    @Override
    public LoginTokens refresh(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new RuntimeException("Refresh token is missing");
        }
        UUID userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!refreshToken.equals(user.getToken())) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        System.out.println("Token refreshed for user: " + user.name);
        String newAccessToken = jwtUtil.generateAccessToken(user.id, user.name);
        String newRefreshToken = jwtUtil.generateRefreshToken(user.id);
        user.setToken(newRefreshToken);
        userRepository.save(user);

        return new LoginTokens(newAccessToken, newRefreshToken,
                new UserResponse(user.id, user.name, user.email));
    }

    @Override
    public void saveRefreshToken(UUID userId, String refreshToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setToken(refreshToken);
        userRepository.save(user);
    }

    @Override
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user.id, user.name, user.email);
    }

    private String hashPassword(String password) {
        return bcrypt.encode(password);
    }

    private Boolean checkPassword(String rawPassword, String hashedPassword) {
        return bcrypt.matches(rawPassword, hashedPassword);
    }

}

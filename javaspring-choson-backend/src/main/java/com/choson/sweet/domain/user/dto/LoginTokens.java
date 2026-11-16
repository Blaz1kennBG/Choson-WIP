package com.choson.sweet.domain.user.dto;

public class LoginTokens {
    public String accessToken;
    public String refreshToken;
    public UserResponse user;

    public LoginTokens(String accessToken, String refreshToken, UserResponse user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}

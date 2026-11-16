package com.choson.sweet.domain.user.dto;

public class LoginResponse {
    public String token;
    public String name;

    public LoginResponse(String token, String name) {
        this.token = token;
        this.name = name;
    }
}

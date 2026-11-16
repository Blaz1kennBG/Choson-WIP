package com.choson.sweet.shared;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;

@Component
@Order(1)
public class AuthFilter implements Filter {

    private final JwtUtil jwtUtil;

    private static final String[] PUBLIC_PATHS = {
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/refresh",

    };

    public AuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String path = req.getRequestURI();

        for (String publicPath : PUBLIC_PATHS) {
            if (path.equals(publicPath)) {
                chain.doFilter(request, response);
                return;
            }
        }
        String token = extractCookie(req, "access_token");
        if (token == null || !jwtUtil.validateToken(token)) {
            res.setStatus(401);
            res.setContentType("application/json");
            res.getWriter().write("{\"message\":\"Unauthorized\"}");
            return;
        }

        UUID userId = jwtUtil.getUserIdFromToken(token);
        req.setAttribute("userId", userId);

        chain.doFilter(request, response);
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

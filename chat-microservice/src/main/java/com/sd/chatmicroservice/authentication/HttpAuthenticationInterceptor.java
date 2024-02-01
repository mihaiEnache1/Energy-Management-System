package com.sd.chatmicroservice.authentication;

import com.sd.chatmicroservice.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
public class HttpAuthenticationInterceptor implements HandlerInterceptor {
    private final JwtService jwtService;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) {
        final String authenticationHeader = request.getHeader("Authorization");
        final String authenticationToken;

        if (authenticationHeader == null || !authenticationHeader.startsWith("Bearer ")) {
            response.setStatus(401);
            return false;
        }

        authenticationToken = authenticationHeader.substring(7);
        if (!jwtService.isTokenValid(authenticationToken)) {
            response.setStatus(401);
            return false;
        }

        return true;
    }
}

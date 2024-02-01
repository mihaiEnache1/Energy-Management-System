package com.sd.chatmicroservice.controller;

import com.sd.chatmicroservice.dto.WebSocketAuthInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/authentication")
@CrossOrigin("http://localhost:4200")
public class AuthenticationController {
    final Cache authCache;

    @Autowired
    public AuthenticationController(CacheManager cacheManager) {
        this.authCache = cacheManager.getCache("AuthCache");
    }

    @GetMapping("/token")
    @ResponseStatus(HttpStatus.OK)
    public UUID authenticate() {
        UUID websocketAuthToken = UUID.randomUUID();

        WebSocketAuthInfo webSocketAuthInfo = new WebSocketAuthInfo(websocketAuthToken);

        authCache.put(websocketAuthToken, webSocketAuthInfo);

        return websocketAuthToken;
    }
}

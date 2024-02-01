package com.sd.chatmicroservice.configuration;

import com.sd.chatmicroservice.authentication.HttpAuthenticationInterceptor;
import com.sd.chatmicroservice.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class HttpEndpointConfig implements WebMvcConfigurer {
    private final JwtService jwtService;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry
                .addInterceptor(new HttpAuthenticationInterceptor(jwtService))
                .addPathPatterns("/authentication/token");
    }
}

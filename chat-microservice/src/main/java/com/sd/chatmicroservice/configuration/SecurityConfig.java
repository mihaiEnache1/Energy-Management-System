//package com.sd.chatmicroservice.configuration;
//
//import com.sd.chatmicroservice.filter.JwtAuthFilter;
//import com.sd.chatmicroservice.service.JwtService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//    private final JwtService jwtService;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.cors();
//        http
//                .csrf()
//                .disable()
//                .authorizeRequests()
//                .requestMatchers("/auth/**").hasAnyAuthority("ADMIN", "CLIENT")
//                .requestMatchers("/chat-socket/**").permitAll()
//                .and()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .addFilterBefore(jwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
//        return http.build();
//    }
//
//    @Bean
//    public JwtAuthFilter jwtAuthFilter(JwtService jwtService) {
//        return new JwtAuthFilter(jwtService);
//    }
//}

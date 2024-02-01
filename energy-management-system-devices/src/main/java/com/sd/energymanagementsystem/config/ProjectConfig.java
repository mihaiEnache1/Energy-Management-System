package com.sd.energymanagementsystem.config;

import com.sd.energymanagementsystem.filter.JwtAuthFilter;
import com.sd.energymanagementsystem.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class ProjectConfig {
    private final JwtService jwtService;

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        return modelMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors();
        http
                .csrf()
                .disable()
                .authorizeRequests()
                .requestMatchers(HttpMethod.POST, "/devices").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/devices").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/devices/get-device/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/devices/**").hasAnyAuthority("ADMIN", "CLIENT")
                .requestMatchers(HttpMethod.GET, "/devices/free-devices").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/devices/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/devices/map/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/devices/**").hasAuthority("ADMIN")
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtService);
    }

}

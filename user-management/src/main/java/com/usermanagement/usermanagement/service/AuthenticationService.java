package com.usermanagement.usermanagement.service;

import com.usermanagement.usermanagement.dto.AuthenticationRequest;
import com.usermanagement.usermanagement.dto.AuthenticationResponse;
import com.usermanagement.usermanagement.dto.RegistrationRequest;
import com.usermanagement.usermanagement.model.Role;
import com.usermanagement.usermanagement.model.User;
import com.usermanagement.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService service;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegistrationRequest request) {
        var user = User
                .builder()
                .uid(UUID.randomUUID())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .build();
        repository.save(user);
        Map<String, Object> extraClaims = generateClaims(user);
        var jwtToken = service.generateToken(extraClaims, user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Map<String, Object> extraClaims = generateClaims(user);
        var jwtToken = service.generateToken(extraClaims, user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    private Map<String, Object> generateClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userUid", user.getUid());
        claims.put("role", user.getRole());
        return claims;
    }
}

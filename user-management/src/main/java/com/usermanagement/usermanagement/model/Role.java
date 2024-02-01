package com.usermanagement.usermanagement.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Role {
    CLIENT(Collections.emptySet()),
    ADMIN(
            Set.of(
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_READ_ALL_USERS,
                    Permission.ADMIN_READ_USER_BY_UID,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_DELETE
            )
    )
    ;

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}

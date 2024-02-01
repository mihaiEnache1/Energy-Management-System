package com.usermanagement.usermanagement.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    ADMIN_CREATE("admin:create"),

    ADMIN_READ_ALL_USERS("admin:read"),
    ADMIN_READ_USER_BY_UID("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_DELETE("admin:delete")
    ;

    @Getter
    private final String permission;
}

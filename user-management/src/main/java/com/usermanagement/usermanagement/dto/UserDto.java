package com.usermanagement.usermanagement.dto;

import com.usermanagement.usermanagement.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID uid;
    private String name;
    private String email;
    private String password;
    private Role role;
}

package com.usermanagement.usermanagement.controller;

import com.usermanagement.usermanagement.dto.UserDto;
import com.usermanagement.usermanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAuthority('admin:create')")
    public ResponseEntity<UserDto> create(@RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.create(userDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('admin:read')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/{uid}")
    @PreAuthorize("hasAuthority('admin:read')")
    public ResponseEntity<UserDto> getUserByUid(@PathVariable UUID uid) {
        return new ResponseEntity<>(userService.getUserByUid(uid), HttpStatus.OK);
    }

    @PutMapping("/{uid}")
    @PreAuthorize("hasAuthority('admin:update')")
    public ResponseEntity<UserDto> update(@PathVariable UUID uid, @RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.update(uid, userDto), HttpStatus.OK);
    }

    @DeleteMapping("/{uid}")
    @PreAuthorize("hasAuthority('admin:delete')")
    public ResponseEntity<Void> delete(@PathVariable UUID uid) {
        userService.delete(uid);
        return ResponseEntity.ok().build();
    }
}

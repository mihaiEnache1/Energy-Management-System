package com.usermanagement.usermanagement.service;

import com.usermanagement.usermanagement.dto.UserDto;
import com.usermanagement.usermanagement.model.User;
import com.usermanagement.usermanagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    @Autowired
    private ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto create(UserDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        user.setUid(UUID.randomUUID());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    public List<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .collect(Collectors.toList());
    }

    public UserDto getUserByUid(UUID uid) {
        User user = userRepository.findUserByUid(uid).orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    public UserDto update(UUID uid, UserDto userDto) {
        User user = userRepository.findUserByUid(uid).orElseThrow(() -> new RuntimeException("User not found"));
        modelMapper.map(userDto, user);
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    public void delete(UUID uid) {
        userRepository.deleteUserByUid(uid);
    }
}

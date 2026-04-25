package com.hospital.controller;

import com.hospital.dto.LoginRequest;
import com.hospital.dto.LoginResponse;
import com.hospital.dto.UserDto;
import com.hospital.service.AuthService;
import com.hospital.service.UserService;
import com.hospital.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("Authentication failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userDto.getPassword() == null || userDto.getPassword().trim().isEmpty()) {
                return new ResponseEntity<>("Password must not be empty", HttpStatus.BAD_REQUEST);
            }

            if (userDto.getRole() == null) {
                userDto.setRole(User.Role.PATIENT);
            }

            UserDto registeredUser = userService.createUser(userDto);

            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>("Registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

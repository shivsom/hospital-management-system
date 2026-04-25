package com.hospital.dto;

import com.hospital.model.User;

public class LoginResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    public LoginResponse() {}

    public LoginResponse(Long id, String email, String firstName, String lastName, User.Role role) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role != null ? role.name() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}


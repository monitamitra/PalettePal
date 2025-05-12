package com.palettepal.my_backend.dto;

public class UserDTO {
    private String username;
    private String password;

    public UserDTO() {}

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}


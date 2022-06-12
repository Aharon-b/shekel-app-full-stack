package com.ab.shekelapp.security.jwt;

public class UserNameAndPasswordAuthenticationRequest {
    private String username;
    private String password;

    public UserNameAndPasswordAuthenticationRequest() {
        // Empty.
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}

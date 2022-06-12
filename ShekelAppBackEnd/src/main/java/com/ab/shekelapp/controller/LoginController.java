package com.ab.shekelapp.controller;

import com.ab.shekelapp.security.entity.Role;
import com.ab.shekelapp.security.entity.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * This class provides user roles list, and user can update is password from this class.
 */
@RestController
@RequestMapping("/api")
public class LoginController {

    /* Calls functions form however implements 'UserService'
       for operations on user type */
    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    /**
     * A function for getting user's role list from the data-base.
     *
     * @return all user's roles.
     */
    @GetMapping("login")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_GUIDE','ROLE_ADMIN','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<List<String>> loginUser() {

        List<String> roles = new ArrayList<>();
        for (Role role : userService.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName()).getRoles()) {
            roles.add(role.getName());
        }
        return ResponseEntity.ok(roles);
    }

    /**
     * A function for changing user's password.
     *
     * @param password the new password.
     * @return operation success message.
     */
    @PostMapping("/user-password-change")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<String> changeUserPassword(@RequestBody String password) {
        return ResponseEntity.ok(userService.changeUserPassword(password));
    }

}

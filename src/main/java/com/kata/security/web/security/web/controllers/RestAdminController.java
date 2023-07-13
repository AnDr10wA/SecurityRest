package com.kata.security.web.security.web.controllers;


import com.kata.security.web.security.web.model.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.kata.security.web.security.web.model.User;
import com.kata.security.web.security.web.services.RoleService;
import com.kata.security.web.security.web.services.UserService;
import java.util.List;


@RestController
@RequestMapping("/api")
public class RestAdminController {
    UserService userService;
    RoleService roleService;

    public RestAdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/users")
    public List<User> allUsers() {
        return userService.findAll();
    }

    @GetMapping("/current-user")
    public User userPage() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user;
    }

    @GetMapping("users/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<HttpStatus> createUser(@RequestBody User user) {
        userService.saveUser(user, user.getRoles());
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<HttpStatus> update(@RequestBody User user) {
        userService.editUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping("/roles")
    public List<Role> showAllUsers() {
        return roleService.getAllRoles();
    }

    @GetMapping("/roles/{name}")
    public Role getSingleUsers(@PathVariable String name) {
        return roleService.findByName(name);
    }
}

package com.kata.security.web.security.web.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import com.kata.security.web.security.web.model.Role;
import com.kata.security.web.security.web.model.User;
import com.kata.security.web.security.web.services.RoleService;
import com.kata.security.web.security.web.services.UserService;

import java.util.*;

@Controller
public class AdminController {
    UserService userService;
    RoleService roleService;


    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String adminka(ModelMap model) {
        List<User> usersList;
        usersList = userService.findAll();
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("usersList", usersList);
        model.addAttribute("newUser", new User());
        model.addAttribute(user);
        return "admin";
    }



    @PostMapping("/admin")
    public String createUser(@ModelAttribute("newUser") User user,
                             @ModelAttribute("roleAdmin") String roleAdmin,
                             @ModelAttribute("roleUser") String roleUser
    ) {
        Collection<Role> listRoles = new HashSet<>();
        if (!roleAdmin.isEmpty()) {
            listRoles.add(roleService.getRoleById(Long.parseLong(roleAdmin)));
        }
        if (!roleUser.isEmpty()) {
            listRoles.add(roleService.getRoleById(Long.parseLong(roleUser)));
        }

        userService.saveUser(user, listRoles);
        return "redirect:/admin";
    }

    @PostMapping("/admin/update")
    public String update(@ModelAttribute("user") User user,
                         @ModelAttribute("roleAdmin") String roleAdmin,
                         @ModelAttribute("roleUser") String roleUser) {

        Collection<Role> listRoles2 = new HashSet<>();
        if (!roleAdmin.isEmpty()) {
            listRoles2.add(roleService.getRoleById(Long.parseLong(roleAdmin)));
        }
        if (!roleUser.isEmpty()) {
            listRoles2.add(roleService.getRoleById(Long.parseLong(roleUser)));
        }

        userService.saveUser(user, listRoles2);
        return "redirect:/admin";
    }

    @PostMapping("/admin/{id}")
    public String delete(@PathVariable("id") Long id) {
        userService.deleteById(id);
        return "redirect:/admin";
    }

}
package com.kata.security.web.security.web.services;

import com.kata.security.web.security.web.model.Role;

import java.util.List;

public interface RoleService {
    public Role getRoleById(Long id);
    public List<Role> getAllRoles();

    public Role findByName(String name);
}

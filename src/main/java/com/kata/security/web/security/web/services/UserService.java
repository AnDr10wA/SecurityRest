package com.kata.security.web.security.web.services;

import com.kata.security.web.security.web.model.Role;
import com.kata.security.web.security.web.model.User;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserService {
    public List<User> findAll();
    public void saveUser(User user, Collection<Role> listRoles);
    public void deleteById(Long id);
    public Optional<User> findById(Long id);
    public void editUser(User user);

}

package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.entities.Role;


import java.util.Collection;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDao roleRepository;

    @Autowired
    public RoleServiceImpl(RoleDao roleRepository) {
        this.roleRepository = roleRepository;
    }


    public  Collection<Role> listRoles() {
        return roleRepository.index();
    }

    @Override
    public List<Role> index() {
        return roleRepository.index();
    }

    @Override
    public Role getRole(Long id) {
        return roleRepository.getRole(id);
    }

    @Override
    public List<Role> getRolesListById(List<Long> roles) {
        return roleRepository.getRolesListById(roles);
    }
}
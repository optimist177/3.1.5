package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Role> index() {
        Query query = entityManager.createQuery("from Role");
        return query.getResultList();
    }


    @Override
    public Role getRole(Long id) {
        return entityManager.find(Role.class,id);
    }


    @Override
    public List<Role> getRolesListById(List<Long> roles) {
        TypedQuery<Role> q = entityManager.createQuery("select r from Role r where r.id in :role", Role.class);
        q.setParameter("role", roles);
        return new ArrayList<>(q.getResultList());
    }
}
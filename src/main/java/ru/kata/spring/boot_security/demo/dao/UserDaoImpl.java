package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.entities.User;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;



    @Override
    public List<User> index() {
        Query query = entityManager.createQuery("from User");
        return query.getResultList();
    }

    @Override
    public Optional<User> show(Long id) {
        return Optional.of(entityManager.find(User.class,id));
    }

    @Override
    public void save(User user) {
        entityManager.persist(user);
    }




    @Override
    public void update(Long id, User user) {
        User userforUpdate = entityManager.find(User.class,id);
        userforUpdate.setUsername(user.getUsername());
        userforUpdate.setPassword(user.getPassword());
        userforUpdate.setEmail(user.getEmail());
        entityManager.merge(userforUpdate);
    }

    @Override
    public void newupdate(User user) {
        entityManager.merge(user);
    }

    @Override
    public void delete(Long id) {
        entityManager.remove(entityManager.find(User.class,id));
    }

    @Override
    public Optional<User> findByUsername(String username) {
        Query query = entityManager.createQuery("select i from User i join fetch i.roles where i.username =: username ");
        query.setParameter("username",username);
        return query.getResultList().stream().findFirst();
    }
}

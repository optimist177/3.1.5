package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {

    List<User> index();
    Optional<User> show(Long id);
    void save(User employee);
    void update(Long id, User employee);
    void delete(Long id);
    Optional<User> findByUsername(String username);
    void newupdate(User user);


}

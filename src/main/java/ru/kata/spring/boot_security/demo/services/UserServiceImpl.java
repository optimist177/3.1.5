package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.entities.Role;
import ru.kata.spring.boot_security.demo.entities.User;



import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class UserServiceImpl implements UserService {



    private final UserDao userRepository;

    private BCryptPasswordEncoder passwordEncoder;


    @Autowired
    public UserServiceImpl(
            UserDao userRepository, BCryptPasswordEncoder passwordEncoder
            ) {
        this.userRepository = userRepository;
        this.passwordEncoder =passwordEncoder;
    }


    public User findUserBYId(Long id) {
        Optional<User> userfromDB  = userRepository.show(id);
        return userfromDB.orElse(new User());
    }


    public List<User> allUsers() {
        return userRepository.index();
    }

    public boolean saveUser(User user) {
        Optional<User> userfromDB = userRepository.findByUsername(user.getUsername());

        if(!userfromDB.isEmpty()) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public boolean deleteUser(Long userId) {
        if (userRepository.show(userId).isPresent()) {
            userRepository.delete(userId);
            return true;
        }
        return false;
    }


    public boolean updateUser(Long userId, User user) {
        if(userRepository.show(userId).isPresent()) {
            User userforUpdate = userRepository.show(userId).get();
            userforUpdate.setUsername(user.getUsername());
            userforUpdate.setPassword(user.getPassword());
            userforUpdate.setEmail(user.getEmail());

            return true;
        }
        return false;
    }


    public User findByUsername(String username) {
        return userRepository.findByUsername(username).get();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).get();
        user.getRoles();
        if (user != null) {
            return user;
        } else {
            throw new UsernameNotFoundException("Пользователя с таким username не существует");
        }
    }

    @Override
    public void newUpdateUser(User user, List<Role> role) {
        String password = findUserBYId(user.getId()).getPassword();
        String pass = user.getPassword();
        if (!passwordEncoder.encode(user.getPassword()).equals(password)){
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        role.stream().forEach(n -> user.addRole(n));
        userRepository.save(user);
    }

}

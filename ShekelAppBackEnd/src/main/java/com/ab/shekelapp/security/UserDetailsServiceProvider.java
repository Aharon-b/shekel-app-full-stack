package com.ab.shekelapp.security;

import com.ab.shekelapp.security.entity.User;
import com.ab.shekelapp.security.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.NoSuchElementException;

public class UserDetailsServiceProvider implements UserDetailsService {
    @Autowired
    private BCryptPasswordEncoder encoder;
    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException, DataAccessException {

        User user = userRepo.findByUsername(username)
                /* 'incorrect email(username) or password' */
                .orElseThrow(() -> new NoSuchElementException("איימיל או סיסמה שגויים"));

        user.setPassword(encoder.encode(user.getPassword()));

        return new MyUserDetails(user);
    }

}

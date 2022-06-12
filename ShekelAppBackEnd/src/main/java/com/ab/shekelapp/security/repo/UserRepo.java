package com.ab.shekelapp.security.repo;

import com.ab.shekelapp.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular user.
 */
public interface UserRepo extends JpaRepository<User, Integer> {

    /**
     * Getting user details from data-base by user name.
     *
     * @param username to find user.
     * @return user details.
     */
    Optional<User> findByUsername(String username);

}

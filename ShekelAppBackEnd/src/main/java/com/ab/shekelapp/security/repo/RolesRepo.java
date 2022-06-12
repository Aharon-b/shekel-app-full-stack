package com.ab.shekelapp.security.repo;

import com.ab.shekelapp.security.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular role.
 */
public interface RolesRepo extends JpaRepository<Role, Integer> {
}

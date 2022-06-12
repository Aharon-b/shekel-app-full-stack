package com.ab.shekelapp.security.entity.interfaces;

import com.ab.shekelapp.security.entity.Role;

/**
 * This interface is used to define a Data Access Object for the role data-source.
 */
public interface RoleService {

    /**
     * Getting a role by id.
     *
     * @param roleId of the role.
     * @return role.
     */
    Role getRole(Integer roleId);

}

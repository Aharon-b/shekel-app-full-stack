package com.ab.shekelapp.security.entity.interfaces.implementions;

import com.ab.shekelapp.security.entity.Role;
import com.ab.shekelapp.security.entity.interfaces.RoleService;
import com.ab.shekelapp.security.repo.RolesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * The class is responsible for all actions performed on role type.
 */
@Service
public class RoleServiceProvider implements RoleService {
    /* For SQL queries on role type */
    private final RolesRepo rolesRepo;

    /* coordinator role in the data-base */
    private static final int COORDINATOR_ROLE = 2;
    /* width-guide role in the data-base */
    private static final int WIDTH_GUIDE_ROLE = 3;
    /* guide role in the data-base */
    private static final int GUIDE_ROLE = 4;

    @Autowired
    public RoleServiceProvider(RolesRepo rolesRepo) {
        this.rolesRepo = rolesRepo;
    }

    @Override
    public Role getRole(Integer roleId) {
        return rolesRepo.findById(roleId).orElseThrow();
    }

    public static int getCoordinatorRole() {
        return COORDINATOR_ROLE;
    }

    public static int getWidthGuideRole() {
        return WIDTH_GUIDE_ROLE;
    }

    public static int getGuideRole() {
        return GUIDE_ROLE;
    }

}

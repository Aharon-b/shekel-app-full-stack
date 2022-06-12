package com.ab.shekelapp.security.entity.interfaces.implementions;

import com.ab.shekelapp.security.entity.Role;
import com.ab.shekelapp.security.entity.User;
import com.ab.shekelapp.security.entity.interfaces.UserService;
import com.ab.shekelapp.security.repo.RolesRepo;
import com.ab.shekelapp.security.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on user type.
 */
@Service
public class UserServiceProvider implements UserService {

    /* For SQL queries on user type */
    private final UserRepo userRepo;
    /* For SQL queries on role type */
    private final RolesRepo rolesRepo;

    private static final String defaultPassword = "1234";

    @Autowired
    public UserServiceProvider(UserRepo userRepo, RolesRepo rolesRepo) {
        this.userRepo = userRepo;
        this.rolesRepo = rolesRepo;
    }

    @Override
    public User findByUsername(String username) {
        return getUser(username);
    }

    @Override
    public void createNewUser(String username, Role role) {
        /* For setting details from the provided json*/
        User user = new User();
        /* Setting ne user details */
        user.setUsername(username);
        user.setPassword(defaultPassword);
        user.setEnabled(true);
        user.getRoles().add(role);
        /* Verifying that this is a new user by resetting the ID to 0 */
        user.setId(0);
        /* Saving data of new user in the data-base */
        userRepo.save(user);
    }

    @Override
    public String changeUserUsername(String currentUsername, String newUsername) {
        /* Getting user from the data-base */
        User user = getUser(currentUsername);
        /* Updating user's username */
        user.setUsername(newUsername);
        /* Saving user new username in the data-base */
        userRepo.save(user);
        /* 'user's email is replaced to ...(new user name)' */
        return "האיימיל של המשתמש הוחלף ל" + newUsername;
    }

    @Override
    public String changeUserPassword(String password) {
        /* Getting user from the data-base */
        User user = getUser(SecurityContextHolder.getContext().getAuthentication().getName());
        /* Updating user's password */
        user.setPassword(password);
        /* Saving user's password in the data-base */
        userRepo.save(user);
        /* 'password of ...(username) is changed' */
        return "הסיסמה של " + user.getUsername() + " שונתה ";
    }

    @Override
    public String removeRoleFromUser(String username, int roleId) {
        /* Getting user from the data-base */
        User user = getUser(username);
        /* Removing role user's roles list */
        user.getRoles().remove(rolesRepo.findById(roleId).orElseThrow());
        /* Saving user without the removed role in the data-base */
        userRepo.save(user);
        /* 'role is removed from user's roles list successfully' */
        return "תפקיד הוסר מרשימת תפקידי המשתמש בהצלחה";
    }

    @Override
    public void addWidthGuideRoleToGuide(String guideUserName) {
        /* Getting user from the data-base */
        User user = getUser(guideUserName);
        /* Adding WIDTH_GUIDE role to user roles list */
        user.getRoles().add(rolesRepo.findById(RoleServiceProvider.getWidthGuideRole()).orElseThrow());
        /* Updating user with the new role in the data-base */
        userRepo.save(user);
    }

    @Override
    public boolean moreThenOneRole(String username) {
        /* Checking if user has more then one role */
        return getUser(username).getRoles().size() > 1;
    }

    @Override
    public void deleteUserFromSystem(String username) {
        /* Getting user from the data-base */
        User user = getUser(username);
        /* Resetting user roles list */
        user.setRoles(null);
        /* Deleting user from the data-base */
        userRepo.delete(user);
    }

    // Help function :

    /**
     * A function for getting user details from the data-base by username
     * (a function only for the class for avoiding code duplication).
     *
     * @param username of the requested user.
     * @return the requested user.
     */
    private User getUser(String username) {
        return userRepo.findByUsername(username)
                // 'no user with provided details in the system'.
                .orElseThrow(() -> new NoSuchElementException("אין משתמש עם הפרטים שהוזנו במערכת"));
    }

}

package com.ab.shekelapp.security.entity.interfaces;

import com.ab.shekelapp.security.entity.Role;
import com.ab.shekelapp.security.entity.User;

/**
 * This interface is used to define a Data Access Object for the user data-source.
 */
public interface UserService {

    /**
     * Getting user details by user's username;
     *
     * @param username user's username.
     * @return user details.
     */
    User findByUsername(String username);

    /**
     * Creating new user.
     *
     * @param username of the new user.
     * @param role     new user's role.
     */
    void createNewUser(String username, Role role);

    /**
     * Updating user's username.
     *
     * @param currentUsername for getting user from the data-base.
     * @param newUsername     the new username.
     * @return operation success message.
     */
    String changeUserUsername(String currentUsername, String newUsername);

    /**
     * Updating user's password.
     *
     * @param password the new password.
     * @return operation success message.
     */
    String changeUserPassword(String password);

    /**
     * Removing role from user's roles list (from guide/width-guide users).
     *
     * @param username of the user.
     * @param roleId   for removing the role.
     * @return operation success message.
     */
    String removeRoleFromUser(String username, int roleId);

    /**
     * Adding WIDTH_GUIDE role to guide from the system.
     *
     * @param guideUserName for getting the user from the system.
     */
    void addWidthGuideRoleToGuide(String guideUserName);

    /**
     * Checking if user has more then one role.
     *
     * @param username of the user to check.
     * @return true if user has more then one role , false if not.
     */
    boolean moreThenOneRole(String username);

    /**
     * Deleting user from the data-base.
     *
     * @param username of the removed user.
     */
    void deleteUserFromSystem(String username);

}

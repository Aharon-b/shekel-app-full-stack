package com.ab.shekelapp.controller;

import com.ab.shekelapp.entity.*;
import com.ab.shekelapp.security.entity.interfaces.RoleService;
import com.ab.shekelapp.security.entity.interfaces.UserService;
import com.ab.shekelapp.security.entity.interfaces.implementions.RoleServiceProvider;
import com.ab.shekelapp.service.ex.ConflictException;
import com.ab.shekelapp.service.interfaces.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * This class allows any admin-type user to create new users
 * (admin,coordinator,width-guide,guide),
 * and to create new apartments and tenants in the system.
 * admin can also connect between tenants with no apartment
 * to apartment form the system and between apartments with no coordinator
 * to coordinator from the system and also between guides with no apartments
 * to apartment from the system.
 * admin can also update is details and delete his account from the system
 * and to delete all the objects he can create from the system.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    /* Calls functions form however implements 'UserService'
       for operations on any kind of user */
    private final UserService userService;
    /* Calls functions form however implements 'RoleService'
       for operations on role type */
    private final RoleService roleService;
    /* Calls functions form however implements 'CoordinatorService'
       for operations on coordinator type */
    private final CoordinatorService coordinatorService;
    /* Calls functions form however implements 'WidthGuideService'
       for operations on width-guide type */
    private final WidthGuideService widthGuideService;
    /* Calls functions form however implements 'GuideService'
       for operations on guide type */
    private final GuideService guideService;
    /* Calls functions form however implements 'ApartmentService'
       for operations on apartment type */
    private final ApartmentService apartmentService;
    /* Calls functions form however implements 'TenantService'
       for operations on tenant type */
    private final TenantService tenantService;
    /* Calls functions form however implements 'ReplacementRequestService'
       for operations on replacement-request type */
    private final ReplacementService replacementService;

    @Autowired
    public AdminController(
            UserService userService,
            CoordinatorService coordinatorService,
            WidthGuideService widthGuideService,
            ApartmentService apartmentService,
            TenantService tenantService,
            GuideService guideService,
            ReplacementService replacementService,
            RoleService roleService) {
        this.userService = userService;
        this.coordinatorService = coordinatorService;
        this.widthGuideService = widthGuideService;
        this.apartmentService = apartmentService;
        this.tenantService = tenantService;
        this.guideService = guideService;
        this.replacementService = replacementService;
        this.roleService = roleService;
    }

    // On admin functions:

    /***
     * A function that gives the front end user's username from the security context holder.
     * @return user name.
     */
    @PostMapping("/admin-username")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> getAdminUsername() {
        return ResponseEntity.ok(getAdminUserUsername());
    }

    /***
     * A function that inserts.
     * @param username for the new user type Admin.
     * @return new admin username after creating him in the database.
     */
    @PostMapping("/new-admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> addNewUserAsAdminToSystem(@RequestBody String username) {
        // Creating new user with ADMIN role.
        createNewUser(username, 1);
        return ResponseEntity.ok(username);
    }

    /**
     * A function that updates admin details.
     *
     * @param newUsername the new user name.
     * @param newPassword the new password.
     * @return success operation message.
     */
    @PostMapping("/update-admin-details")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> updateAdminDetails(
            @RequestBody String newUsername,
            @RequestParam("password") String newPassword) {
        // Strings for checking which admin details to update.
        String usernameChanged = null;
        String passwordChanged = null;

        // Checking if to update password.
        if (!newPassword.equals("")) {
            // Updating password.
            passwordChanged = userService.changeUserPassword(newPassword);
        }

        // Checking if to update user's user name.
        if (!newUsername.equals("")) {
            // Updating user's user name.
            usernameChanged = userService.changeUserUsername(getAdminUserUsername(), newUsername);
        }

        // Returning string of the updated params.
        return ResponseEntity.ok(setUpdateDetailsResponse(usernameChanged, passwordChanged));
    }

    /**
     * A function that deletes user's account in case of one role,
     * and in case of more then one role, removing the ADMIN role from
     * user's roles list in the database.
     *
     * @return Success deleting admin account from the system .
     */
    @DeleteMapping("/delete-admin-account-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteAdminAccountFromSystem() {
        String adminUsername = getAdminUserUsername();
        // Deleting admin account from the system.
        userService.deleteUserFromSystem(adminUsername);
        // Returning success deleting admin account from the system.
        // ('admin account of ....(admin user name) is deleted from the system').
        return ResponseEntity.ok("חשבון מנהל של " + adminUsername + "נמחק מהמערכת");
    }

    // On coordinator functions:

    /**
     * A function for creating a new coordinator object in the data-base.
     *
     * @param file              image of the new coordinator.
     * @param jsonAsCoordinator new coordinator's details.
     * @return the created coordinator.
     * @throws JSONException if can't find field in the JSONObject.
     */
    @PostMapping("/new-coordinator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Coordinator> createNewCoordinator(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("coordinator") JSONObject jsonAsCoordinator) throws JSONException {
        // Creating new user with COORDINATOR role.
        createNewUser((String) jsonAsCoordinator.get("username"), RoleServiceProvider.getCoordinatorRole());
        // Creating new coordinator.
        return ResponseEntity.ok(coordinatorService.createNewCoordinator(file, jsonAsCoordinator));
    }

    /**
     * A function for returning list of all coordinators from the database.
     *
     * @return all coordinators in the database.
     */
    @PostMapping("all-coordinators")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Coordinator>> getAllCoordinators() {
        return ResponseEntity.ok(coordinatorService.getAllCoordinators());
    }

    /**
     * A function for returning list of all coordinators with no width-guide from the database.
     *
     * @return all coordinators in the database with no width-guide.
     */
    @PostMapping("all-coordinators-no-width-guide")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Coordinator>> getAllCoordinatorsWithNoWidthGuide() {
        return ResponseEntity.ok(coordinatorService.getAllCoordinators().stream()
                .filter(coordinator -> coordinator.getWidthGuide() == null).collect(Collectors.toList()));
    }

    /**
     * A function for adding a apartment with no coordinator to a coordinator from the data-base
     * apartment's list.
     *
     * @param apartmentId the apartment to add to coordinator's apartments list.
     * @param coordinator the coordinator to add apartment to.
     * @return the added apartment.
     */
    @PostMapping("/add-apartment-to-coordinator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Apartment> addApartmentToCoordinator_sList(
            @RequestParam("apartmentId") String apartmentId, @RequestBody Coordinator coordinator) {
        return ResponseEntity.ok(apartmentService.addApartmentToCoordinatorApartmentList(
                parseLong(apartmentId), coordinator));
    }

    /**
     * A function for returning coordinator from the data-base apartments list.
     *
     * @param coordinatorId for the coordinator's apartments list.
     * @return coordinator's apartments list.
     */
    @PostMapping("/coordinator-apartments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Apartment>> getCoordinatorApartments(
            @RequestBody Long coordinatorId) {
        return ResponseEntity.ok(apartmentService.getAllCoordinatorApartments(coordinatorId));
    }

    /**
     * A function for deleting coordinator from the data-base.
     *
     * @param coordinatorId of the deleted apartment.
     * @return deleting coordinator success message.
     * @throws NoSuchFieldException if can't find coordinator.
     */
    @DeleteMapping("/delete-coordinator-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteCoordinatorFromSystem(@RequestParam String coordinatorId) throws NoSuchFieldException {
        // Getting coordinator details from system.
        Coordinator coordinator = coordinatorService.getCoordinator(parseLong(coordinatorId));
        // A list for for coordinator's apartments ids.
        List<Long> apartmentsIdList = new ArrayList<>();
        // adding all coordinator's apartments ids.
        coordinator.getApartments().forEach(apartment -> apartmentsIdList.add(apartment.getId()));
        // Setting all apartments coordinator as null.
        for (int i = 0; i < apartmentsIdList.size(); i++) {
            apartmentService.removeApartmentFromCoordinatorApartmentsList(apartmentsIdList.get(i), apartmentsIdList);
        }
        // Deleting user from system.
        userService.deleteUserFromSystem(coordinator.getUsername());
        // Deleting coordinator from system.
        return ResponseEntity.ok(coordinatorService.deleteCoordinatorFromSystem(coordinator.getId()));
    }

    // On width-guide functions:

    /**
     * A function for creating a new width-guide object in the data-base.
     *
     * @param widthGuide    the created width-guide.
     * @param coordinatorId for adding the created width-guide to coordinator from the data-base.
     * @return the created width-guide.
     */
    @PostMapping("/add-new-width-guide")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<WidthGuide> createNewWidthGuide(
            @RequestBody WidthGuide widthGuide,
            @RequestParam("coordinatorId") String coordinatorId) {
        // Creating new user with WIDTH_GUIDE role.
        createNewUser(widthGuide.getUsername(), RoleServiceProvider.getWidthGuideRole());
        // Creating new width-guide.
        return ResponseEntity.ok(widthGuideService.createWidthGuide(widthGuide,
                coordinatorService.getCoordinator(parseLong(coordinatorId))));
    }

    /**
     * A function for adding a 'WIDTH-GUIDE' role to a user type guide from the data-base
     * (and creating a new width-guide in the data-base).
     *
     * @param guide         the guide to add role to.
     * @param coordinatorId for attaching width-guide to coordinator from the data-base.
     * @param phoneNumber   every width-guide is getting a phone from the work-place.
     * @return the created width-guide.
     */
    @PostMapping("/add-width-guide-from-guides")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<WidthGuide> createNewWidthGuideFromGuideInSystemDetails(
            @RequestBody Guide guide,
            @RequestParam("coordinatorId") String coordinatorId,
            @RequestParam("phoneNumber") String phoneNumber) {
        // Getting guide details from the system.
        String guideUsername = guideService.findGuideUsernameById(guide.getId());
        // Adding WIDTH_GUIDE role to guide.
        userService.addWidthGuideRoleToGuide(guideUsername);
        // Creating new width-guide with guide details.
        return ResponseEntity.ok(widthGuideService.createWidthGuideWithGuideDetails(
                guide, coordinatorService.getCoordinator(parseLong(coordinatorId)), guideUsername, phoneNumber));
    }

    /**
     * A function for returning list of all width-guides from the database.
     *
     * @return all width-guides in the database.
     */
    @PostMapping("all-width-guides")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<WidthGuide>> getAllWidthGuidesInTheSystem() {
        return ResponseEntity.ok(widthGuideService.getAllWidthGuides());
    }

    /**
     * A function for getting width-guide's apartments coordinator.
     *
     * @param widthGuideId for the width-guide object.
     * @return width-guide's apartments coordinator.
     */
    @PostMapping("/width-guide-coordinator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Coordinator> getWidthGuideCoordinator(
            @RequestBody String widthGuideId) {
        return ResponseEntity.ok(widthGuideService.getWidthGuide(parseLong(widthGuideId)).getCoordinator());
    }

    /**
     * A function for deleting widthGuide from the data-base.
     *
     * @param widthGuideId of the deleted apartment.
     * @return deleting widthGuide success message.
     */
    @DeleteMapping("/delete-width-guide-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteWidthGuideFromSystem(@RequestParam String widthGuideId) {
        // Getting width-guide's username.
        String widthGuideUserName = widthGuideService.getWidthGuide(parseLong(widthGuideId)).getUsername();

        // Checking if width-guide is also a guide.
        if (userAsMoreThenOneRole(widthGuideUserName)) {
            // If so, removing the 'WIDTH_GUIDE' role from the user's roles list.
            return ResponseEntity.ok(userService.removeRoleFromUser(widthGuideUserName, RoleServiceProvider.getWidthGuideRole()));
        }
        // Else, deleting user from system.
        userService.deleteUserFromSystem(widthGuideUserName);

        // Deleting width-guide from system.
        return ResponseEntity.ok(widthGuideService.deleteWidthGuideFromSystem(parseLong(widthGuideId)));
    }

    // On guide functions:

    /**
     * A function for creating a new tenant object in the data-base.
     *
     * @param file        image of the new guide.
     * @param jsonAsGuide new guide's details.
     * @return the created guide.
     */
    @PostMapping("/new-guide")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Guide> createNewGuide(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("guide") JSONObject jsonAsGuide
    ) throws JSONException {
        // Creating new user with GUIDE role.
        createNewUser(jsonAsGuide.getString("username"), RoleServiceProvider.getGuideRole());
        // Creating new guide.
        return ResponseEntity.ok(guideService.createNewGuide(file, jsonAsGuide));
    }

    /**
     * A function for returning list of all guides from the database.
     *
     * @return all guides in the database.
     */
    @PostMapping("all-guides")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Guide>> getAllGuidesInTheSystem() {
        return ResponseEntity.ok(guideService.getAllGuides());
    }

    /**
     * A function for returning list of all guides with no apartments from the database.
     *
     * @return all guides with no apartments in the database.
     */
    @PostMapping("/all-guides-no-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Guide>> getAllGuidesWithNoApartments() {
        return ResponseEntity.ok(guideService.getAllGuides().stream()
                .filter(guide -> guide.getApartments().isEmpty()).collect(Collectors.toUnmodifiableList()));
    }

    /**
     * A function for getting guide's apartments from the database.
     *
     * @param guideId for guide's apartments.
     * @return guide apartments list.
     */
    @PostMapping("guide-apartments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public synchronized ResponseEntity<List<Apartment>> getGuideApartments(@RequestBody Long guideId) {
        return ResponseEntity.ok(guideService.getGuide(guideId).getApartments());
    }

    /**
     * When admin wants to add width-guide to the data-base, can add from the guides in the data-base
     * the function is returning all of the guides that doesn't have 'WIDTH-GUIDE' role.
     *
     * @return list of all guides in the data-base without 'WIDTH-GUIDE' role.
     */
    @PostMapping("/all-guides-one-role")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Guide>> getAllUsersWithOneRoleAsGuide() {
        return ResponseEntity.ok(guideService.getAllGuidesThatAreNotWidthGuides());
    }

    /**
     * A function for deleting guide from the data-base.
     *
     * @param guideId of the deleted apartment.
     * @return deleting guide success message.
     */
    @DeleteMapping("delete-guide-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteGuideFromSystem(@RequestParam String guideId) {
        // Getting guide's username.
        String guideUsername = guideService.getGuide(parseLong(guideId)).getUsername();
        // Checking if guide has also a 'WIDTH_GUIDE' role.
        if (userAsMoreThenOneRole(guideUsername)) {
            // If so, removing the 'Guide' role from the user's roles list.
            return ResponseEntity.ok(userService.removeRoleFromUser(guideUsername, RoleServiceProvider.getGuideRole()));
        }
        // Else, deleting user from system.
        userService.deleteUserFromSystem(guideUsername);

        // Deleting guide from the system.
        return ResponseEntity.ok(guideService.deleteGuideFromSystem(parseLong(guideId)));
    }

    // On apartment functions:

    /**
     * A function for creating a new apartment object in the data-base.
     *
     * @param file            image of the new apartment.
     * @param jsonAsApartment new apartment's details.
     * @return the created apartment.
     */
    @PostMapping("/new-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Apartment> createNewApartment(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("apartment") JSONObject jsonAsApartment) {
        return ResponseEntity.ok(apartmentService.createNewApartment(file, jsonAsApartment));
    }

    /**
     * A function for returning list of all apartments from the database.
     *
     * @return all apartments in the database.
     */
    @PostMapping("all-apartments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Apartment>> getAllApartmentsInTheSystem() {
        return ResponseEntity.ok(apartmentService.getAllApartments());
    }

    /**
     * A function for returning list of all apartments with no coordinator from the database.
     *
     * @return all apartments with no coordinator in the database.
     */
    @PostMapping("/all-apartments-no-coordinator")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Apartment>> getAllApartmentsNoCoordinator() {
        return ResponseEntity.ok(apartmentService.getAllApartmentsNoCoordinator());
    }

    /**
     * A function for adding guide from the data-base to apartment in the data-base
     * guide's list.
     *
     * @param guideId     for the added guide.
     * @param apartmentId for the apartment to add guide to.
     * @return the apartment that guide was added to.
     * @throws ConflictException (user type coordinator can also add guide to apartment).
     */
    @PostMapping("/add-guide-to-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Apartment> addGuideToApartment(
            @RequestBody Long guideId,
            @RequestParam String apartmentId) throws ConflictException {
        return ResponseEntity.ok(apartmentService.addGuideToApartmentGuidesList(guideService.getGuide(guideId), parseLong(apartmentId), null));
    }

    /**
     * A function for adding tenant with no apartment to apartment from the data-base
     * tenants list.
     *
     * @param tenantId    for the added tenant.
     * @param apartmentId for the apartment to add tenant.
     * @return the added tenant.
     * @throws ConflictException if tenant is already registered to apartment in the data-base.
     */
    @PostMapping("/add-tenant-to-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Tenant> addTenantToApartment(
            @RequestBody Long tenantId,
            @RequestParam String apartmentId) throws ConflictException {
        return ResponseEntity.ok(tenantService.addTenantToApartment(
                apartmentService.getApartmentByApartmentId(parseLong(apartmentId)), tenantId));
    }

    /**
     * A function for deleting apartment from the data-base.
     *
     * @param apartmentId of the deleted apartment.
     * @return deleting apartment success message.
     */
    @DeleteMapping("delete-apartment-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteApartmentFromSystem(@RequestParam String apartmentId) {
        // Referring the given string id to a long object.
        long longApartmentId = parseLong(apartmentId);
        // Getting the apartment.
        Apartment apartment = apartmentService.getApartmentByApartmentId(longApartmentId);
        // Removing tenants from apartment list.
        tenantService.setTenantApartmentNullBeforeRemovingApartment(apartment.getTenants());
        // Deleting replacements with apartment from the system.
        replacementService.getAllWithApartmentId(apartment.getId()).forEach(replacement ->
        {
            try {
                replacementService.deleteReplacement(replacement.getId(), replacement.getGuide().getId());
            } catch (ConflictException ignore) {
                // Exception is thrown when guide deletes replacement from system.
            }
        });
        // Deleting apartment from the data base and returning success operation message.
        return ResponseEntity.ok(apartmentService.removeApartmentFromSystem(longApartmentId));
    }

    // On tenant functions:

    /**
     * A function for creating a new tenant object in the data-base.
     *
     * @param file         image of the new tenant.
     * @param jsonAsTenant new tenant's details.
     * @return the created tenant.
     */
    @PostMapping("/new-tenant")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Tenant> createNewTenant(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("tenant") JSONObject jsonAsTenant) {
        return ResponseEntity.ok(tenantService.createTenant(file, jsonAsTenant));
    }

    /**
     * A function for getting tenant's apartment name.
     *
     * @param tenantId for tenant's apartment_id.
     * @return tenant's apartment name.
     */
    @PostMapping("tenant-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public synchronized ResponseEntity<String> getTenantApartment(@RequestBody Long tenantId) {
        return ResponseEntity.ok(apartmentService.findTenantApartmentName(tenantId));
    }

    /**
     * Because tenant can be only in an apartment with the same gender,
     * this function is returning all of the apartments in the data-base with the same gender.
     *
     * @param tenant for checking which apartments to return.
     * @return all apartments in the data-base with the same gender.
     */
    @PostMapping("/tenant-gender-apartments")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Apartment>> getTenant_sGenderApartments(@RequestBody Tenant tenant) {
        return ResponseEntity.ok(apartmentService.getAllApartments().stream()
                .filter(apartment -> apartment.getGender().equals(tenant.getShekelMember().getGender()))
                .collect(Collectors.toList())
        );
    }

    /**
     * A function for returning list of all tenants from the database.
     *
     * @return all tenants in the database.
     */
    @PostMapping("all-tenants")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Tenant>> getAllTenantsInTheSystem() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    /**
     * A function for returning list of all tenants with no apartment from the database.
     *
     * @return all tenants with no apartment in the database.
     */
    @PostMapping("all-tenants-no-apartment")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<Tenant>> getAllTenantsWithNoApartment() {
        return ResponseEntity.ok(tenantService.getAllTenantsWithNoApartment());
    }

    /**
     * A function for deleting tenant from the data-base.
     *
     * @param tenantId of the deleted apartment.
     * @return deleting tenant success message.
     */
    @DeleteMapping("delete-tenant-from-system")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteTenantFromSystem(@RequestParam String tenantId) throws NoSuchFieldException {
        return ResponseEntity.ok(tenantService.deleteTenantFromSystem(parseLong(tenantId)));
    }

    // Help functions:

    private String getAdminUserUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void createNewUser(String username, int roleNumber) {
        userService.createNewUser(username, roleService.getRole(roleNumber));
    }

    private boolean userAsMoreThenOneRole(String username) {
        return userService.findByUsername(username).getRoles().size() > 1;
    }

    private String setUpdateDetailsResponse(String usernameChanged, String passwordChanged) {
        // For returning success message after updating details.
        String response = "";

        // Checking which details was updated.
        if (usernameChanged != null) {
            response = usernameChanged;
        }

        if (passwordChanged != null) {
            response += " " + passwordChanged;
        }

        return response;
    }

    private Long parseLong(String stringToParse) {
        return Long.parseLong(stringToParse);
    }

}

package com.ab.shekelapp.controller;

import com.ab.shekelapp.data.CoordinatorReplacementsToApproveObject;
import com.ab.shekelapp.entity.*;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.ab.shekelapp.security.entity.interfaces.UserService;
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
import java.util.NoSuchElementException;

/**
 * This class allows coordinator type user to update details
 * and to update -> apartment/tenant/medicine/chore details
 * and to remove -> tenant from apartment tenants list/apartment from coordinator apartments list
 * / guide from apartment guides list.
 * and to delete -> medicine/chore from the system
 * and to add -> guide from the system to apartment guides list/a new replacement request
 * /new medicine to tenant medicine list /new chore to tenant chores list
 * and to approve/reject replacement offer.
 */
@RestController
@RequestMapping("/api")
public class CoordinatorController {
    /* Calls functions form however implements 'UserService'
       for operations on user type */
    private final UserService userService;
    /* Calls functions form however implements 'CoordinatorService'
       for operations on coordinator type */
    private final CoordinatorService coordinatorService;
    /* Calls functions form however implements 'GuideService'
       for operations on guide type */
    private final GuideService guideService;
    /* Calls functions form however implements 'TenantService'
       for operations on tenant type */
    private final TenantService tenantService;
    /* Calls functions form however implements 'ApartmentService'
       for operations on apartment type */
    private final ApartmentService apartmentService;
    /* Calls functions form however implements 'MedicineService'
       for operations on medicine type */
    private final MedicineService medicineService;
    /* Calls functions form however implements 'ChoreService'
       for operations on chore type */
    private final ChoreService choreService;
    /* Calls functions form however implements 'ReplacementRequestService'
       for operations on replacementRequest type */
    private final ReplacementService replacementService;

    @Autowired
    public CoordinatorController(
            CoordinatorService coordinatorService,
            GuideService guideService,
            TenantService tenantService,
            ApartmentService apartmentService,
            MedicineService medicineService,
            ChoreService choreService,
            UserService userService,
            ReplacementService replacementRequestService) {
        this.coordinatorService = coordinatorService;
        this.guideService = guideService;
        this.tenantService = tenantService;
        this.apartmentService = apartmentService;
        this.medicineService = medicineService;
        this.choreService = choreService;
        this.userService = userService;
        this.replacementService = replacementRequestService;
    }

    // On coordinator functions:

    /**
     * A function that returns coordinator details from the data-base.
     *
     * @return coordinator details.
     */
    @GetMapping("coordinator-details")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Coordinator> getCoordinatorDetails() {
        return ResponseEntity.ok(getCoordinatorByUserName());
    }

    /**
     * A function for updating coordinator details + image.
     *
     * @param file              for the new coordinator's image.
     * @param jsonAsCoordinator for the new coordinator's details.
     * @return coordinator with the new details.
     * @throws JSONException in case can't find 'username' field in the Json object.
     */
    @PostMapping("update-coordinator-details")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Coordinator> updateCoordinatorDetails(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("coordinator") JSONObject jsonAsCoordinator
    ) throws JSONException {
        // Checking if to update coordinator's user name.
        if (checkAndChangeUsername((String) jsonAsCoordinator.get("username"))) {
            jsonAsCoordinator.remove("username");
            jsonAsCoordinator.put("username", getCoordinatorUsername());
        }
        // Updating coordinator's details/image.
        return ResponseEntity.ok(coordinatorService.updateCoordinator(file, jsonAsCoordinator));
    }

    /**
     * A function for updating coordinator details.
     *
     * @param coordinator for the coordinator details to update.
     * @return updated coordinator details.
     */
    @PostMapping("update-coordinator-details-no-image")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Coordinator> updateCoordinatorDetailsNoImage(
            @RequestBody Coordinator coordinator) {
        // Checking if to update coordinator's user name.
        if (checkAndChangeUsername(coordinator.getUsername())) {
            coordinator.setUsername(getCoordinatorUsername());
        }
        // Updating coordinator's details.
        return ResponseEntity.ok(coordinatorService.updateCoordinatorNoImage(coordinator));
    }

    /**
     * A function for getting coordinator's image.
     *
     * @return coordinator's image byte array.
     */
    @PostMapping("coordinator-image")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Byte[]> getCoordinatorImage() {
        return ResponseEntity.ok(getCoordinatorByUserName()
                .getShekelMember()
                .getImage());
    }

    /**
     * A function for getting coordinator's apartments list from the data-base.
     *
     * @return coordinator's apartments list.
     */
    @PostMapping("coordinator-apartments")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<List<Apartment>> getCoordinatorApartmentsList() {
        return ResponseEntity.ok(getCoordinatorByUserName().getApartments());
    }

    /**
     * A function for getting coordinator's tenants list from the data-base.
     *
     * @return coordinator's tenants list.
     */
    @PostMapping("/coordinator-tenants")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<List<Tenant>> getCoordinatorTenantsList() {
        return ResponseEntity.ok(tenantService.getCoordinatorTenants(getCoordinatorByUserName()));
    }

    /**
     * A function for getting coordinator's replacements approval list from the data-base.
     *
     * @return coordinator's replacements approval list.
     */
    @PostMapping("coordinator-approval-list")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<List<CoordinatorReplacementsToApproveObject>> getCoordinatorApprovalList() {
        // Creating list of approval replacements.
        List<CoordinatorReplacementsToApproveObject> coordinatorApprovalList = new ArrayList<>();
        // Adding coordinator's replacements to approve to the list.
        replacementService.coordinatorReplacementRequestsToApprove(getCoordinatorByUserName().getId())
                .forEach((request, guide) ->
                        coordinatorApprovalList.add(new CoordinatorReplacementsToApproveObject(guide, request)));
        // Returning the list.
        return ResponseEntity.ok(coordinatorApprovalList);
    }

    // On guide functions:

    /**
     * A function for returning guide from one of coordinator's apartments details from the data-base.
     *
     * @param guideId for guide's details.
     * @return guide's details.
     */
    @PostMapping("guide-details")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Guide> getGuideDetails(@RequestBody Long guideId) {
        return ResponseEntity.ok(guideService.getGuide(guideId));
    }

    /**
     * A function for getting guide's image.
     *
     * @return guide's image byte array.
     */
    @PostMapping("guide-image")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<Byte[]> getGuideImage(@RequestBody Long guideId) {
        return ResponseEntity.ok(guideService.getGuide(guideId)
                .getShekelMember()
                .getImage());
    }

    // On tenant functions:

    /**
     * A function for getting tenant's image.
     *
     * @return tenant's image byte array.
     */
    @PostMapping("tenant-image")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<Byte[]> getTenantImage(@RequestBody Long tenantId) {
        return ResponseEntity.ok(tenantService.getTenant(tenantId)
                .getShekelMember()
                .getImage());
    }

    /**
     * A function for getting tenant's medicine list from the data-base.
     *
     * @param tenantId for tenant's medicines.
     * @return tenant's medicine list.
     */
    @PostMapping("/tenant-medicines")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<List<Medicine>> getTenantMedicineList(@RequestBody Long tenantId) {
        return ResponseEntity.ok(medicineService.getTenantMedicineList(tenantId));
    }

    /**
     * A function for getting tenant's chores list from the data-base.
     *
     * @param tenantId for tenant's chores.
     * @return tenant's chores list.
     */
    @PostMapping("/tenant-chores")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<List<Chore>> getTenantChoresList(@RequestBody Long tenantId) {
        return ResponseEntity.ok(choreService.getTenantChores(tenantId));
    }

    /**
     * A function for updating tenant details + image.
     *
     * @param file         for the new tenant's image.
     * @param jsonAsTenant for the new tenant's details.
     * @return tenant with the new details.
     */
    @PostMapping("/update-tenant")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Tenant> updateTenantDetails(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("tenant") JSONObject jsonAsTenant) {
        return ResponseEntity.ok(tenantService.updateTenant(file, jsonAsTenant));
    }

    /**
     * A function for updating tenant details.
     *
     * @param tenant for the tenant details to update.
     * @return updated tenant details.
     */
    @PostMapping("update-tenant-no-image")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Tenant> updateTenantNoImage(@RequestBody Tenant tenant) {
        return ResponseEntity.ok(tenantService.updateTenantNoImage(tenant));
    }

    // On apartment functions:

    /**
     * A function for getting apartment's image.
     *
     * @return apartment's image byte array.
     */
    @PostMapping("apartment-image")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<Byte[]> getApartmentImage(@RequestBody Long apartmentId) {
        return ResponseEntity.ok(apartmentService.getApartmentByApartmentId(apartmentId)
                .getImage());
    }

    /**
     * A function for updating apartment details + image.
     *
     * @param file            for the new apartment's image.
     * @param jsonAsApartment for the new apartment's details.
     * @return apartment with the new details.
     */
    @PostMapping("/update-apartment-details")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Apartment> updateApartmentDetails(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("apartment") JSONObject jsonAsApartment) {
        return ResponseEntity.ok(apartmentService.updateApartmentDetails(file, jsonAsApartment));
    }

    /**
     * A function for updating apartment details.
     *
     * @param apartment for the apartment details to update.
     * @return updated apartment details.
     */
    @PostMapping("update-apartment-details-no-image")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Apartment> updateApartmentDetailsNoImage(@RequestBody Apartment apartment) {
        return ResponseEntity.ok(apartmentService.updateApartmentDetailsNoImage(apartment));
    }

    /**
     * A function for getting apartment tenants list from the data-base.
     *
     * @param apartmentId for getting apartment tenants list.
     * @return list of apartment tenants.
     */
    @PostMapping("/apartment-tenants")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<List<Tenant>> getApartmentTenantsList(@RequestBody Long apartmentId) {
        return ResponseEntity.ok(apartmentService.getApartmentByApartmentId(apartmentId)
                .getTenants());
    }

    /**
     * A function for getting apartment guides list from the data-base.
     *
     * @param apartmentId for getting apartment guides list.
     * @return list of apartment guides.
     */
    @PostMapping("apartment-guides")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<List<Guide>> getApartmentGuidesList(@RequestBody Long apartmentId) {
        return ResponseEntity.ok(apartmentService.getApartmentByApartmentId(apartmentId)
                .getGuides());
    }

    /**
     * If coordinator wants to add guide to apartment guides list,
     * this function is returning all guides in the data-base that are not in the apartment guides list.
     *
     * @param apartment for removing apartment guides from the returned list.
     * @return all guides in the system that are not in the apartment guides list.
     */
    @PostMapping("all-guides-not-from-apartment")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<List<Guide>> getGuidesApartmentDoNotHaveList(@RequestBody Apartment apartment) {
        // Checking if apartment is one of coordinator's apartments list.
        checkIfApartmentBelongToCoordinator(apartment.getId());
        // Returning list of guides that are not in the apartment's guides list.
        return ResponseEntity.ok(guideService.getAllGuidesNotInApartment(apartment));
    }

    /**
     * A function for adding guide to apartment guides list in the data-base.
     *
     * @param guide       the guide to add.
     * @param apartmentId add to apartment.
     * @return the added guide.
     * @throws ConflictException if apartment isn't in the coordinator apartments list.
     */
    @PostMapping("/add-guide-to-apartment")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<Guide> addGuideFromSystemToApartment(
            @RequestBody Guide guide, @RequestParam String apartmentId) throws ConflictException {
        // Adding guide to apartment guides list.
        apartmentService.addGuideToApartmentGuidesList(guide, parseLong(apartmentId), getCoordinatorByUserName());
        return ResponseEntity.ok(guide);
    }

    /**
     * A function for removing apartment from coordinator apartments list.
     *
     * @param apartmentId the removed apartment id.
     * @return operation success message.
     * @throws NoSuchFieldException if apartment is not a part of coordinator's apartments list.
     */
    @DeleteMapping("/remove-apartment-from-coordinator")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<String> removeApartmentFromCoordinatorApartmentsList(@RequestParam String apartmentId)
            throws NoSuchFieldException {
        // For checking if apartment belongs to coordinator.
        List<Long> apartmentsIdList = new ArrayList<>();
        // Adding all coordinator apartments ids.
        getCoordinatorByUserName().getApartments().forEach(apartment -> apartmentsIdList.add(apartment.getId()));
        // Removing apartment from coordinator apartment list and returning success operation message.
        return ResponseEntity.ok(
                apartmentService.removeApartmentFromCoordinatorApartmentsList(parseLong(apartmentId), apartmentsIdList));
    }

    /**
     * A function for removing a tenant from apartment tenants list.
     *
     * @param tenantId of the removed tenant.
     * @return success operation message.
     * @throws ConflictException in case tenant isn't in the coordinator's tenants list.
     */
    @DeleteMapping("remove-tenant-from-apartment")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<String> removeTenantFromApartmentTenantsList(
            @RequestParam String tenantId) throws ConflictException {
        return ResponseEntity.ok(tenantService.removeTenantFromApartment(getCoordinatorByUserName(),
                (parseLong(tenantId))));
    }

    /**
     * A function for removing guide from apartment guides list.
     *
     * @param guideId     for the removed guide.
     * @param apartmentId for the apartment to removed guide from.
     */
    @DeleteMapping("/remove-guide-from-apartment")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public void removeGuideFromApartmentGuidesList(
            @RequestParam String guideId, @RequestParam String apartmentId) {
        long longApartmentId = parseLong(apartmentId);
        // Checking if guide is in one of coordinator's apartments guides list.
        checkIfApartmentBelongToCoordinator(longApartmentId);
        // Removing guide from apartment's guides list.
        apartmentService.removeGuideFromApartment(longApartmentId,
                guideService.getGuide(parseLong(guideId)));
    }

    // On medicine functions:

    /**
     * A function for getting tenant medicine image.
     *
     * @return apartment's image byte array.
     */
    @PostMapping("medicine-image")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE','ROLE_GUIDE')")
    public ResponseEntity<Byte[]> getMedicineImage(@RequestBody Long medicineId) {
        return ResponseEntity.ok(medicineService.getMedicine(medicineId).getImage());
    }

    /**
     * A function for creating a new medicine in a tenant medicine list.
     *
     * @param file           for medicine image.
     * @param jsonAsMedicine medicine details.
     * @param tenantId       for adding the new medicine to tenant's medicine list.
     * @return the new created medicine.
     */
    @PostMapping("/new-medicine")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Medicine> createNewMedicine(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("medicine") JSONObject jsonAsMedicine,
            @RequestParam String tenantId) {
        return ResponseEntity.ok(medicineService.createMedicine(
                file, jsonAsMedicine, tenantService.getTenant(parseLong(tenantId))));
    }

    /**
     * A function for updating medicine details + image.
     *
     * @param file           for the new medicine's image.
     * @param jsonAsMedicine for the new medicine's details.
     * @return medicine with the new details.
     */
    @PostMapping("/update-medicine")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Medicine> updateMedicineDetails(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("medicine") JSONObject jsonAsMedicine) throws JSONException {
        return ResponseEntity.ok(medicineService.updateMedicine(file,
                tenantService.getTenant(jsonAsMedicine.getJSONObject("tenant").getLong("id")),
                jsonAsMedicine));
    }

    /**
     * A function for updating medicine details.
     *
     * @param medicine for the medicine details to update.
     * @return updated medicine details.
     */
    @PostMapping("/update-medicine-without-image")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Medicine> updateMedicineDetailsWithOutImage(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.updateMedicineWithOutImage(medicine));
    }

    /**
     * A function for deleting medicine details from the system.
     *
     * @param medicineId the deleted medicine id.
     * @return operation success message.
     */
    @DeleteMapping("/medicine-delete")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<String> deleteMedicine(@RequestParam String medicineId) {
        return ResponseEntity.ok(medicineService.deleteMedicineFromSystem(parseLong(medicineId)));
    }

    // On chore functions:

    /**
     * A function for creating a new chore in a tenant chores list.
     *
     * @param chore    medicine details.
     * @param tenantId for adding the new chore to tenant's chores list.
     * @return the new created chore.
     */
    @PostMapping("/new-chore")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Chore> createNewChore(@RequestBody Chore chore, @RequestParam String tenantId) {
        return ResponseEntity.ok(choreService.createChore(chore, tenantService.getTenant(parseLong(tenantId))));
    }

    /**
     * A function for updating chore details.
     *
     * @param chore for the chore details to update.
     * @return updated chore details.
     */
    @PostMapping("update-chore-details")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Chore> updateChoreDetails(@RequestBody Chore chore) {
        return ResponseEntity.ok(choreService.updateChore(chore));
    }

    /**
     * A function for deleting chore details from the system.
     *
     * @param chore the deleted chore.
     * @return operation success message.
     */
    @DeleteMapping("/remove-chore")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<String> deleteChore(@RequestBody Chore chore) {
        return ResponseEntity.ok(choreService.removeChore(chore));
    }

    // On replacement functions:

    /**
     * A function for approving guide replacement offer t a replacement request in the system.
     *
     * @param guideId              of the replacement offer.
     * @param replacementRequestId the approved replacement request id.
     * @return 'approved request' message.
     */
    @PostMapping("approve-replacement-request")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<String> approveReplacementRequest(
            @RequestBody Long guideId, @RequestParam String replacementRequestId) {
        return ResponseEntity.ok(replacementService.approveReplacementRequest(
                guideService.getGuide(guideId), parseLong(replacementRequestId), getCoordinatorByUserName().getId()));
    }

    /**
     * A function for rejecting guide replacement offer t a replacement request in the system.
     *
     * @param guide                of the replacement offer.
     * @param replacementRequestId the rejected replacement request id.
     * @return 'rejected request' message.
     */
    @PostMapping("reject-replacement-request")
    @PreAuthorize("hasRole('ROLE_COORDINATOR')")
    public ResponseEntity<String> rejectReplacementRequest(
            @RequestBody Guide guide, @RequestParam String replacementRequestId) {
        return ResponseEntity.ok(replacementService.rejectReplacementRequest(guide, parseLong(replacementRequestId)));
    }

    /**
     * A function for adding a new replacement request to the data-base.
     *
     * @param replacementRequest the new replacement request.
     * @return the new added replacement request.
     * @throws ConflictException if apartment already has a request that the shift times
     *                           overlaps with the new request shift times.
     */
    @PostMapping("add-replacement-request-no-guide")
    @PreAuthorize("hasAnyRole('ROLE_COORDINATOR','ROLE_WIDTH_GUIDE')")
    public ResponseEntity<Replacement> addApartmentReplacementFromCoordinatorApartmentsList(
            @RequestBody Replacement replacementRequest) throws ConflictException {
        return ResponseEntity.ok(replacementService.createReplacement(null, replacementRequest));
    }

    /* Help functions*/

    private Coordinator getCoordinatorByUserName() {
        return coordinatorService.getCoordinatorByUsername(SecurityContextHolder.getContext()
                .getAuthentication()
                .getName());
    }

    private void checkIfApartmentBelongToCoordinator(Long apartmentId) {
        Coordinator coordinator = getCoordinatorByUserName();
        coordinator.getApartments()
                .stream()
                .filter(apartment -> apartment.getId() == apartmentId)
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException(
                        // 'no apartment with the provided data in ...(coordinator's name) apartments list'.
                        getCoordinatorUsername() + "אין דירה עם הנתונים שניתנו ברשימת הדירות של "));
    }

    public static String getCoordinatorUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean checkAndChangeUsername(String newUsername) {
        String currentUsername = getCoordinatorUsername();
        if (newUsername.equals("")) {
            return true;
        } else if (!newUsername.equals(currentUsername)) {
            userService.changeUserUsername(currentUsername, newUsername);
        }
        return false;
    }

    private Long parseLong(String stringToParse) {
        return Long.parseLong(stringToParse);
    }

}

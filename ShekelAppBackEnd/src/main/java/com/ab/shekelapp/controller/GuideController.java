package com.ab.shekelapp.controller;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.entity.WidthGuide;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.ab.shekelapp.security.entity.interfaces.UserService;
import com.ab.shekelapp.service.ex.ConflictException;
import com.ab.shekelapp.service.interfaces.GuideService;
import com.ab.shekelapp.service.interfaces.ReplacementService;
import com.ab.shekelapp.service.interfaces.WidthGuideService;
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

/**
 * This class allows guide type user to update details
 * and to add/delete replacement request/offer
 * and to offer him-self to a replacement request.
 */
@RestController
@RequestMapping("/api")
public class GuideController {

    /* Calls functions form however implements 'UserService'
       for operations on user type */
    private final UserService userService;
    /*Calls functions form however implements 'GuideService'
      for operations on guide type */
    private final WidthGuideService widthGuideService;
    /* Calls functions form however implements 'GuideService'
       for operations on guide type */
    private final GuideService guideService;
    /* Calls functions form however implements 'ReplacementRequestService'
       for operations on replacementRequest type */
    private final ReplacementService replacementService;

    @Autowired
    public GuideController(GuideService guideService,
                           UserService userService,
                           WidthGuideService widthGuideService,
                           ReplacementService replacementRequestService) {
        this.guideService = guideService;
        this.userService = userService;
        this.widthGuideService = widthGuideService;
        this.replacementService = replacementRequestService;
    }

    // On guide functions:

    /**
     * A function for getting guide details.
     *
     * @return guide details.
     */
    @GetMapping("/guide-details")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Guide> getGuideDetails() {
        return ResponseEntity.ok(getGuideByUserName());
    }

    /**
     * A function for updating guide details + image.
     *
     * @param file        for the new guide's image.
     * @param jsonAsGuide for the new guide's details.
     * @return guide with the new details.
     * @throws JSONException in case can't find 'username' field in the Json object.
     */
    @PostMapping("/update-guide-details")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Guide> updateGuideDetails(
            @RequestParam("imagefile") MultipartFile file,
            @RequestParam("guide") JSONObject jsonAsGuide
    ) throws JSONException {
        // Checking if to change username.
        String username = isUsernameEmpty(jsonAsGuide.get("username").toString());

        Guide guide = new Guide();
        guide.setShekelMember(new ShekelMember());
        // Checking if to change details in user other role (width-guide).
        if (hasMultipleRoles(username)) {
            updateAnotherRole(turnJsonToWidthGuideObject(jsonAsGuide, username));
            setGuideDetails(guideService.getGuide(jsonAsGuide.getLong("id")), guide);
        }
        // Updating guide details in the data-base.
        return ResponseEntity.ok(guideService.updateGuide(guide, file, jsonAsGuide));
    }

    /**
     * A function for updating guide details.
     *
     * @param guide for the guide details to update.
     * @return updated guide details.
     */
    @PostMapping("/update-guide-details-no-image")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Guide> updateGuideWithOutImage(@RequestBody Guide guide) {
        String username = isUsernameEmpty(guide.getUsername());
        // Checking if to change details in user other role (width-guide).
        if (hasMultipleRoles(username)) {
            WidthGuide widthGuide = new WidthGuide();
            widthGuide.setShekelMember(guide.getShekelMember());
            widthGuide.setUsername(guide.getUsername());
            updateAnotherRole(widthGuide);
            setGuideDetails(guideService.getGuide(guide.getId()), guide);
        }
        // Updating guide details in the data-base.
        return ResponseEntity.ok(guideService.updateGuideWithOutImage(guide, getGuideUsername()));
    }

    /**
     * A function for returning guide apartments list.
     *
     * @return all guide apartments.
     */
    @PostMapping("/guide-apartments")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Apartment>> getApartments() {
        return ResponseEntity.ok(getGuideByUserName().getApartments());
    }

    /**
     * A function for getting guide apartments tenants list.
     *
     * @return all guide tenants.
     */
    @PostMapping("/guide-tenants")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Tenant>> getGuideTenants() {
        /* For collecting guide's tenants */
        List<Tenant> tenants = new ArrayList<>();
        /* Collecting guide's tenants */
        getGuideByUserName().getApartments().forEach(apartment -> tenants.addAll(apartment.getTenants()));
        /* Returning list */
        return ResponseEntity.ok(tenants);
    }

    /**
     * A function for getting all guide replacements types from the data-base.
     *
     * @return list of all guide replacements types.
     */
    @PostMapping("guide-all-replacements")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Replacement>> getAllGuideReplacementsRequestsAndOffers() {
        return ResponseEntity.ok(replacementService.getAllGuideReplacementsRequestsAndOffers(getGuideByUserName().getId()));
    }

    /**
     * A function for getting all guide approved replacements offers.
     *
     * @return list of all guide's approved replacements offers.
     */
    @PostMapping("guide-replacement-approved-offers")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Replacement>> getGuideReplacementApprovedOffers() {
        return ResponseEntity.ok(replacementService.getGuideReplacementApprovedOffers(getGuideByUserName().getId()));
    }

    // On replacements functions:

    /**
     * A function for getting all replacements requests that doesn't belong to guide from the data-base.
     *
     * @return list of all replacements requests that doesn't belong to guide.
     */
    @PostMapping("/all-not-guide's-requests")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Replacement>> getAllNotGuidesReplacementsRequests() {
        return ResponseEntity.ok(replacementService.getAllNotGuide_sRequests(getGuideByUserName()));
    }

    /**
     * A function for adding a new replacement request/offer to guide's replacements list in the data-base.
     *
     * @param replacement the new replacement.
     * @return the new added replacement.
     * @throws ConflictException in case the replacement is a request type and the apartment
     *                           in the request already has a replacement request with times that are
     *                           coincided with the new replacement request.
     */
    @PostMapping("/add-replacement")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Replacement> addReplacementToGuideArray(
            @RequestBody Replacement replacement) throws ConflictException {
        return ResponseEntity.ok(replacementService.createReplacement(getGuideByUserName(), replacement));
    }

    /**
     * A function for deleting a replacement from guide replacements in the data-base.
     *
     * @param replacementId for the deleted replacement.
     * @return the deleted replacement id.
     * @throws ConflictException if replacement doesn't belong to guide.
     */
    @DeleteMapping("delete-replacement")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Long> deleteReplacement(@RequestParam String replacementId) throws ConflictException {
        return ResponseEntity.ok(
                replacementService.deleteReplacement(Long.parseLong(replacementId), getGuideByUserName().getId()));
    }

    /**
     * A function for getting all not guide requests the overlaps the given offer in the data-base.
     *
     * @param offer for matching with requests.
     * @return list of all not guide requests that the shift times overlaps with the offer shift times.
     */
    @PostMapping("offer-has-requests")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<List<Replacement>> checkIfRequestHasOffers(@RequestBody Replacement offer) {
        return ResponseEntity.ok(replacementService.checkIfOfferHasRequests(offer, getGuideByUserName()));
    }

    /**
     * A function for adding guide's replacement offer to a request to the relevant coordinator's
     * replacement approval list.
     *
     * @param replacementRequest for adding request details to coordinator's approval list.
     * @param offerId            for adding offer details to coordinator's approval list.
     * @return operation success message.
     * @throws ConflictException if the request is already in a approval proses.
     */
    @PostMapping("request-offer-approval")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<String> sendRequestAndOfferToCoordinatorsApproval(
            @RequestBody Replacement replacementRequest, @RequestParam String offerId) throws ConflictException {
        return ResponseEntity.ok(replacementService.sendRequestAndOfferToCoordinatorsApproval(
                replacementRequest, getGuideByUserName(), Long.parseLong(offerId)));
    }

    /**
     * A function for checking request is not in a approval proses.
     *
     * @param replacementRequestId for getting the request from the data-base.
     * @return boolean is request in a approval proses.
     * @throws ConflictException if guide already has a different replacement with overlap shift times as the
     *                           replacement request in the data-base.
     */
    @PostMapping("check-approval-status")
    @PreAuthorize("hasRole('ROLE_GUIDE')")
    public ResponseEntity<Boolean> checkIfReplacementIsInApprovingProcess(
            @RequestBody Long replacementRequestId) throws ConflictException {
        return ResponseEntity.ok(replacementService.
                checkIfReplacementIsInApprovingProcess(replacementRequestId, getGuideByUserName()));
    }

    // help functions:

    private Guide getGuideByUserName() {
        return guideService.getGuideByUserName(getGuideUsername());
    }

    private static String getGuideUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void updateAnotherRole(WidthGuide widthGuide) {
        ShekelMember shekelMember = widthGuideService.getWidthGuideByUsername(getGuideUsername()).getShekelMember();
        widthGuide.getShekelMember().setPhoneNumber(shekelMember.getPhoneNumber());
        widthGuide.getShekelMember().setGender(shekelMember.getGender());
        widthGuideService.updateWidthGuide(widthGuide, getGuideUsername());
    }

    private WidthGuide turnJsonToWidthGuideObject(JSONObject jsonAsGuide, String username) throws JSONException {
        WidthGuide widthGuide = new WidthGuide();
        widthGuide.setUsername(username);
        JSONObject shekelMember = jsonAsGuide.getJSONObject("shekelMember");
        widthGuide.setShekelMember(new ShekelMember());
        widthGuide.getShekelMember().setFirstName(shekelMember.get("firstName").toString());
        widthGuide.getShekelMember().setLastName(shekelMember.get("lastName").toString());
        return widthGuide;
    }

    private boolean hasMultipleRoles(String username) {
        return userService.moreThenOneRole(username);
    }

    private void setGuideDetails(Guide systemGuide, Guide guide) {
        guide.getShekelMember().setPhoneNumber(systemGuide.getShekelMember().getPhoneNumber());
        guide.getShekelMember().setImage(systemGuide.getShekelMember().getImage());
        guide.getShekelMember().setGender(systemGuide.getShekelMember().getGender());
    }

    private String isUsernameEmpty(String username) {
        if (username.equals("")) {
            return getGuideUsername();
        } else {
            checkAndChangeUsername(username);
            return username;
        }
    }

    private void checkAndChangeUsername(String newUsername) {
        String currentUsername = getGuideByUserName().getUsername();
        if (!newUsername.equals(currentUsername)) {
            userService.changeUserUsername(currentUsername, newUsername);
        }
    }

}

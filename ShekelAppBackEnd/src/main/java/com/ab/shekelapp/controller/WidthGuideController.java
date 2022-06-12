package com.ab.shekelapp.controller;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.entity.WidthGuide;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.security.entity.interfaces.UserService;
import com.ab.shekelapp.service.interfaces.GuideService;
import com.ab.shekelapp.service.interfaces.WidthGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * This class allows width-guide type user to update details
 * and to add/update/delete medicine/chore details
 * and to add a new replacement request
 */
@RestController
@RequestMapping("/api")
public class WidthGuideController {
    /* Calls functions form however implements 'UserService'
         for operations on user type */
    private final UserService userService;
    /* Calls functions form however implements 'WidthGuideService'
       for operations on width-guide type */
    private final WidthGuideService widthGuideService;
    /* Calls functions form however implements 'GuideService'
       for operations on guide type */
    private final GuideService guideService;

    @Autowired
    public WidthGuideController(WidthGuideService widthGuideService, UserService userService, GuideService guideService) {
        this.widthGuideService = widthGuideService;
        this.userService = userService;
        this.guideService = guideService;
    }

    // On width-guide function:

    /**
     * A function for getting width-guide details.
     *
     * @return width-guide details.
     */
    @GetMapping("width-guide-details")
    @PreAuthorize("hasRole('ROLE_WIDTH_GUIDE')")
    public ResponseEntity<WidthGuide> getWidthGuideDetails() {
        return ResponseEntity.ok(getWidthGuideByUserName());
    }

    /**
     * A function for updating width-guide details.
     *
     * @param widthGuide for the width-guide details to update.
     * @return updated width-guide details.
     */
    @PostMapping("update-width_guide-details")
    @PreAuthorize("hasRole('ROLE_WIDTH_GUIDE')")
    public ResponseEntity<WidthGuide> updateWidthGuideDetails(@RequestBody WidthGuide widthGuide) {
        // Checking if to change username.
        if (widthGuide.getUsername().equals("")) {
            widthGuide.setUsername(getWidthGuideUsername());
        } else if (!widthGuide.getUsername().equals(getWidthGuideUsername())) {
            userService.changeUserUsername(getWidthGuideUsername(), widthGuide.getUsername());
        }

        // Checking if to change details in user other role (guide).
        if (userService.moreThenOneRole(widthGuide.getUsername())) {
            guideService.updateGuideWithOutImage(setGuideWithWidthGuideDetails(widthGuide), getWidthGuideUsername());
            setWidthGuideDetails(widthGuideService.getWidthGuide(widthGuide.getId()), widthGuide);
        }
        // Updating width-guide details in the data-base.
        return ResponseEntity.ok(widthGuideService.updateWidthGuide(widthGuide, getWidthGuideUsername()));
    }

    /**
     * A function for returning width-guide apartments list.
     *
     * @return all width-guide apartments.
     */
    @PostMapping("width-guide-apartments")
    @PreAuthorize("hasRole('ROLE_WIDTH_GUIDE')")
    public ResponseEntity<List<Apartment>> getWidthGuideApartments() {
        return ResponseEntity.ok(getWidthGuideByUserName()
                .getCoordinator()
                .getApartments());
    }

    /**
     * A function for getting width-guide apartments tenants list.
     *
     * @return all width-guide tenants.
     */
    @PostMapping("width-guide-tenants")
    @PreAuthorize("hasRole('ROLE_WIDTH_GUIDE')")
    public ResponseEntity<List<Tenant>> getWidthGuideTenants() {
        List<Tenant> tenants = new ArrayList<>();
        getWidthGuideByUserName().getCoordinator().getApartments()
                .forEach(apartment -> tenants.addAll(apartment.getTenants()));
        return ResponseEntity.ok(tenants);
    }

    // Help function:

    public static String getWidthGuideUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private WidthGuide getWidthGuideByUserName() {
        return widthGuideService.getWidthGuideByUsername(getWidthGuideUsername());
    }

    private Guide setGuideWithWidthGuideDetails(WidthGuide widthGuide) {
        Guide guide = new Guide();
        guide.setShekelMember(widthGuide.getShekelMember());
        ShekelMember shekelMember = guideService.getGuideByUserName(getWidthGuideUsername()).getShekelMember();
        guide.getShekelMember().setPhoneNumber(shekelMember.getPhoneNumber());
        guide.getShekelMember().setImage(shekelMember.getImage());
        guide.getShekelMember().setGender(shekelMember.getGender());
        guide.setUsername(widthGuide.getUsername());
        return guide;
    }

    private void setWidthGuideDetails(WidthGuide systemWidthGuide, WidthGuide widthGuide) {
        widthGuide.getShekelMember().setPhoneNumber(systemWidthGuide.getShekelMember().getPhoneNumber());
        widthGuide.getShekelMember().setImage(systemWidthGuide.getShekelMember().getImage());
        widthGuide.getShekelMember().setGender(systemWidthGuide.getShekelMember().getGender());
    }

}

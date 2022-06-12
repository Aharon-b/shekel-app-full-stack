package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.WidthGuide;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.repo.WidthGuideRepo;
import com.ab.shekelapp.service.interfaces.WidthGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on width-guide type.
 */
@Service
public class WidthGuideServiceProvider implements WidthGuideService {
    /* For SQL queries on width-guide type */
    private final WidthGuideRepo widthGuideRepo;
    /* 'no width guide with provided details in the system' */
    private static final NoSuchElementException noWidthGuideErrorMessage = new NoSuchElementException("אין רכז.ת תפעולי.ת עם הנתונים שסופקו במערכת");

    @Autowired
    public WidthGuideServiceProvider(WidthGuideRepo widthGuideRepo) {
        this.widthGuideRepo = widthGuideRepo;
    }

    @Override
    public WidthGuide getWidthGuide(long widthGuideId) {
        return widthGuideRepo.findById(widthGuideId).orElseThrow(() -> noWidthGuideErrorMessage);
    }

    @Override
    public WidthGuide getWidthGuideByUsername(String username) {
        return widthGuideRepo.findByUsername(username)
                .orElseThrow(() -> noWidthGuideErrorMessage);
    }

    @Override
    public WidthGuide createWidthGuide(WidthGuide widthGuide, Coordinator coordinator) {
        /* Verifying that this is a new tenant by resetting the ID to 0 */
        widthGuide.setId(0);
        /* Attaching new width guide to coordinator*/
        widthGuide.setCoordinator(coordinator);
        /* Saving data of new width-guide in the data-base */
        return widthGuideRepo.save(widthGuide);
    }

    @Override
    public WidthGuide createWidthGuideWithGuideDetails(Guide guide, Coordinator coordinator,
                                                       String guideUserName, String phoneNumber) {
        /* Setting guide's and other field to new width-guide
           object and saving data of new width-guide in the data-base */
        return widthGuideRepo.save(setNewWidthGuideWithGuideDetails(guide, coordinator, guideUserName, phoneNumber));
    }

    @Override
    public WidthGuide updateWidthGuide(WidthGuide widthGuide, String currentUsername) {
        /* Getting width-guide from the data-base */
        WidthGuide systemWidthGuide = widthGuideRepo.findByUsername(currentUsername)
                .orElseThrow(() -> noWidthGuideErrorMessage);
        /* Verifying updating width-guide details */
        widthGuide.setId(systemWidthGuide.getId());
        /* Checking that the fields in the provided guide are not empty,
         * if one of the fields is empty the function fills the field from info in the database */
        widthGuide.checkAndSetEmptyFields(systemWidthGuide.getShekelMember());
        /* Attaching width-guide to coordinator */
        widthGuide.setCoordinator(systemWidthGuide.getCoordinator());
        /* Updating details in the data-base and returning the updated width-guide details */
        return widthGuideRepo.save(widthGuide);
    }

    @Override
    public List<WidthGuide> getAllWidthGuides() {
        /* Returning the data of all width-guides in the system */
        return widthGuideRepo.findAll();
    }

    @Override
    public String deleteWidthGuideFromSystem(long Id) {
        /* Getting width-guide from system */
        WidthGuide widthGuide = widthGuideRepo.findById(Id)
                .orElseThrow(() -> noWidthGuideErrorMessage);
        /* Resetting width-guide's coordinator field */
        widthGuide.setCoordinator(null);
        /* Deleting width-guide from the system. */
        widthGuideRepo.delete(widthGuide);
        /* '...(width-guide name) is deleted from the system' */
        return widthGuide.getShekelMember().getFirstName() + widthGuide.getShekelMember()
                .getLastName() + " נמחק מהמערכת ";
    }

    // Help function:

    /**
     * This function is called when adding to guide from the system WIDTH_GUIDE role
     * for creating a new width guide object with guide's details.
     *
     * @param guide         to get and set data.
     * @param coordinator   to attach width guide to coordinator from the system.
     * @param guideUserName for width-guide's username.
     * @param phoneNumber   width-guide's phone number.
     * @return new width-guide with guide's data.
     */
    private WidthGuide setNewWidthGuideWithGuideDetails(Guide guide, Coordinator coordinator, String guideUserName, String phoneNumber) {
        WidthGuide widthGuide = new WidthGuide();
        widthGuide.setShekelMember(new ShekelMember());
        widthGuide.setId(0);
        widthGuide.setUsername(guideUserName);
        widthGuide.setCoordinator(coordinator);
        widthGuide.getShekelMember().setFirstName(guide.getShekelMember().getFirstName());
        widthGuide.getShekelMember().setLastName(guide.getShekelMember().getLastName());
        widthGuide.getShekelMember().setGender(guide.getShekelMember().getGender());
        widthGuide.getShekelMember().setPhoneNumber(phoneNumber);
        return widthGuide;
    }

}

package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.repo.GuideRepo;
import com.ab.shekelapp.security.entity.User;
import com.ab.shekelapp.security.entity.interfaces.implementions.RoleServiceProvider;
import com.ab.shekelapp.security.repo.UserRepo;
import com.ab.shekelapp.service.interfaces.GuideService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on guide type.
 */
@Service
public class GuideServiceProvider implements GuideService {

    /* For SQL queries on guide type */
    private final GuideRepo guideRepo;
    /* For SQL queries on user type */
    private final UserRepo userRepo;

    @Autowired
    public GuideServiceProvider(GuideRepo guideRepo, UserRepo userRepo) {
        this.guideRepo = guideRepo;
        this.userRepo = userRepo;
    }

    @Override
    public Guide getGuide(long guideId) {
        return getGuideByGuideId(guideId);
    }

    @Override
    public Guide getGuideByUserName(String username) {
        return guideRepo.findByUsername(username);
    }

    @Override
    public Guide createNewGuide(MultipartFile file, JSONObject jsonAsGuide) {
        /* For setting details from the provided json */
        Guide guide = new Guide();
        /* Setting details from the provided json */
        setGuideDetails(guide, jsonAsGuide, false);
        /* Setting image from the provided file */
        guide.getShekelMember().setFileImage(file);
        /* Verifying that this is a new guide by resetting the ID to 0 */
        guide.setId(0L);
        /* Saving data of new guide in the data-base */
        return guideRepo.save(guide);
    }

    @Override
    public Guide updateGuide(Guide guide, MultipartFile file, JSONObject jsonAsGuide) {
        /* Setting details from the provided json */
        setGuideDetails(guide, jsonAsGuide, true);
        guide.checkAndSetEmptyFields(getGuideByGuideId(guide.getId()).getShekelMember());
        /* Setting image from the provided file */
        guide.getShekelMember().setFileImage(file);
        /* Updating details in the data-base and returning the updated guide details */
        return guideRepo.save(guide);
    }

    @Override
    public Guide updateGuideWithOutImage(Guide guide, String username) {
        /* Getting guide details from the data-base */
        Guide systemGuide = guideRepo.findByUsername(username);
        /* Verifying updating guide details */
        guide.setId(systemGuide.getId());
        /* Checking that the fields in the provided guide are not empty,
           if one of the fields is empty the function fills the field from info in the database */
        guide.checkAndSetEmptyFields(systemGuide.getShekelMember());
        /* Attaching guide to his/hers apartments */
        guide.setApartments(systemGuide.getApartments());
        /* Updating details in the data-base and returning the updated guide details */
        return guideRepo.save(guide);
    }

    @Override
    public List<Guide> getAllGuides() {
        /* Returning the data of all guides in the system */
        return guideRepo.findAll();
    }

    @Override
    public List<Guide> getAllGuidesNotInApartment(Apartment apartment) {
        List<Guide> guidesNotBelongToApartment = new ArrayList<>();
        /* Running on all of the guides in the data-base */
        for (Guide guide : guideRepo.findAll()) {
            /* Checking if guide is already in the apartment guides list. */
            if (guide.getApartments()
                    .stream()
                    .filter(systemApartment -> systemApartment.getId() == apartment.getId())
                    .findFirst()
                    .isEmpty()) {
                /* If not ---> adding guide to the returned list */
                guidesNotBelongToApartment.add(guide);
            }
        }

        /* Checking if the apartment is a girls apartment
           (guide with a BOYS gender can't be in a apartment with a GIRLS gender) */
        if (apartment.getGender() == ApartmentsAndTenantsGender.GIRLS) {
            /* Removing all boy guides from the returned list */
            guidesNotBelongToApartment.removeIf(guide -> guide
                    .getShekelMember()
                    .getGender() != ApartmentsAndTenantsGender.GIRLS);
        }
        /* Returning the list */
        return guidesNotBelongToApartment;
    }

    @Override
    public List<Guide> getAllGuidesThatAreNotWidthGuides() {
        ArrayList<Guide> guidesThatAreNotWidthGuides = new ArrayList<>();
        /* Running on all of the guides in the data-base */
        for (Guide guide : guideRepo.findAll()) {
            /* Checking if guide has also a WIDTH_GUIDE role. */
            User user = userRepo.findByUsername(guide.getUsername())
                    .orElseThrow(() -> new NoSuchElementException(guide.getUsername()));
            if (user.getRoles().stream()
                    .filter(role -> role.getId() == RoleServiceProvider.getWidthGuideRole()).findFirst().isEmpty()) {
                /* If not ---> adding guide to the returned list. */
                guidesThatAreNotWidthGuides.add(guide);
            }
        }
        /* Returning the list */
        return guidesThatAreNotWidthGuides;
    }

    @Override
    public String findGuideUsernameById(Long guideId) {
        /* Returning guide's username */
        return getGuideByGuideId(guideId).getUsername();
    }

    @Override
    public String deleteGuideFromSystem(long guideId) {
        /* Getting guide from system */
        Guide guide = getGuideByGuideId(guideId);
        /* Removing all apartments from guide apartments list */
        guide.setApartments(null);
        /* Deleting guide from the system. */
        guideRepo.delete(guide);
        /* '...(guide name) is deleted from the system' */
        return guide.getShekelMember().getFirstName() + " נמחק מהמערכת ";
    }

    // Help functions:

    /**
     * A function for extracting new/updated guide details from a json object
     * and setting them in the guide object (for when creating a new guide/updating guide
     * details + image).
     *
     * @param guide       the set the details to.
     * @param jsonAsGuide to get details from.
     * @param update      for checking which details needs to be extracted form the json object.
     */
    private void setGuideDetails(Guide guide, JSONObject jsonAsGuide, boolean update) {
        long guideId;
        try {
            if (update) {
                guideId = Integer.toUnsignedLong((Integer) jsonAsGuide.get("id"));
                guide.setId(guideId);
                guide.setApartments(getGuideByGuideId(guideId).getApartments());
            }

            guide.setShekelMember(new ShekelMember());
            JSONObject shekelMember = jsonAsGuide.getJSONObject("shekelMember");
            guide.getShekelMember().setFirstName((String) shekelMember.get("firstName"));
            guide.getShekelMember().setLastName((String) shekelMember.get(("lastName")));
            guide.setUsername((String) jsonAsGuide.get(("username")));
            guide.getShekelMember().setPhoneNumber((String) shekelMember.get(("phoneNumber")));
            String gender = (String) shekelMember.get("gender");
            if (gender.equals(ApartmentsAndTenantsGender.BOYS.toString())) {

                guide.getShekelMember().setGender(ApartmentsAndTenantsGender.BOYS);

            } else if (gender.equals(ApartmentsAndTenantsGender.GIRLS.toString())) {
                guide.getShekelMember().setGender(ApartmentsAndTenantsGender.GIRLS);
            }


        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * A function for getting guide details from the data-base by id
     * (a function only for the class for avoiding code duplication).
     *
     * @param guideId of the requested guide.
     * @return the requested guide.
     */
    private Guide getGuideByGuideId(Long guideId) {
        return guideRepo.findById(guideId)
                /* 'no guide with provided details in the system ' */
                .orElseThrow(() -> new NoSuchElementException("אין מדריך עם הנתונים שהוצגו במערכת"));
    }

}

package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Guide;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the guide data-source.
 */
public interface GuideService {

    /**
     * Getting guide details by id.
     *
     * @param guideId of the requested guide.
     * @return the requested guide.
     */
    Guide getGuide(long guideId);

    /**
     * Getting guide details by username.
     *
     * @param username of the requested guide.
     * @return the requested guide.
     */
    Guide getGuideByUserName(String username);

    /**
     * Creating new guide.
     *
     * @param file        new guide's image.
     * @param jsonAsGuide new guide's details.
     * @return the new created guide.
     */
    Guide createNewGuide(MultipartFile file, JSONObject jsonAsGuide);

    /**
     * Updating guide details + image.
     *
     * @param guide       in case user has also width-guide role (for updating the other role (width-guide) details
     *                    before updating guide details).
     * @param file        the new image.
     * @param jsonAsGuide the new details.
     * @return updated guide details.
     */
    Guide updateGuide(Guide guide, MultipartFile file, JSONObject jsonAsGuide);

    /**
     * Updating guide details.
     *
     * @param guide    the new details.
     * @param username for getting guide from the date-base.
     * @return updated guide details.
     */
    Guide updateGuideWithOutImage(Guide guide, String username);

    /**
     * Getting all guides from the data-base.
     *
     * @return all guides from the data-base.
     */
    List<Guide> getAllGuides();

    /**
     * Getting all guides that are not in apartment's guides list from the data-base.
     *
     * @param apartment for checking which guides are not in the apartment's guide list.
     * @return all guides that are not in the apartment's guides list.
     */
    List<Guide> getAllGuidesNotInApartment(Apartment apartment);

    /**
     * Getting all guides that has only one role (guide).
     *
     * @return all guide that are not width-guides.
     */
    List<Guide> getAllGuidesThatAreNotWidthGuides();

    /**
     * Getting guide's username by guide's id.
     *
     * @param guideId for getting username.
     * @return guide's username.
     */
    String findGuideUsernameById(Long guideId);

    /**
     * Deleting guide from the data-base.
     *
     * @param guideId the deleted guide.
     * @return success operation message.
     */
    String deleteGuideFromSystem(long guideId);

}

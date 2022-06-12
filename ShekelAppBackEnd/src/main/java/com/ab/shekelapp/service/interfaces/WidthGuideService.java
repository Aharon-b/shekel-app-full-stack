package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.WidthGuide;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the width-guide data-source.
 */
public interface WidthGuideService {

    /**
     * Getting width-guide details by id.
     *
     * @param widthGuideId of the requested width-guide.
     * @return the requested width-guide.
     */
    WidthGuide getWidthGuide(long widthGuideId);

    /**
     * Getting width-guide details by username.
     *
     * @param username of the requested width-guide.
     * @return the requested width-guide.
     */
    WidthGuide getWidthGuideByUsername(String username);

    /**
     * Creating a new width-guide in the date-base.
     *
     * @param widthGuide  new width-guide details.
     * @param coordinator for attaching width-guide to coordinator.
     * @return new width-guide details.
     */
    WidthGuide createWidthGuide(WidthGuide widthGuide, Coordinator coordinator);

    /**
     * Adding WIDTH_GUIDE role to a guide from the system + (creating a new width-guide)
     *
     * @param guide         to add role to.
     * @param coordinator   for attaching width-guide to coordinator.
     * @param guideUserName for setting new width-guide username.
     * @param phoneNumber   width-guide phone number (different from guide's phone number).
     * @return new created width-guide.
     */
    WidthGuide createWidthGuideWithGuideDetails(Guide guide, Coordinator coordinator, String guideUserName, String phoneNumber);

    /**
     * Updating width-guide details.
     *
     * @param widthGuide the new details.
     * @param username   for getting width-guide from the date-base.
     * @return updated width-guide details.
     */
    WidthGuide updateWidthGuide(WidthGuide widthGuide, String username);

    /**
     * Getting all width-guides from the data-base.
     *
     * @return all width-guides from the data-base.
     */
    List<WidthGuide> getAllWidthGuides();

    /**
     * Deleting width-guide from the data-base.
     *
     * @param widthGuideId the deleted width-guide.
     * @return success operation message.
     */
    String deleteWidthGuideFromSystem(long widthGuideId);

}

package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Coordinator;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the coordinator data-source.
 */
public interface CoordinatorService {

    /**
     * Getting coordinator details by id.
     *
     * @param coordinatorId of the requested coordinator.
     * @return the requested coordinator.
     */
    Coordinator getCoordinator(long coordinatorId);

    /**
     * Getting coordinator details by username.
     *
     * @param username of the requested coordinator.
     * @return the requested coordinator.
     */
    Coordinator getCoordinatorByUsername(String username);

    /**
     * Creating new coordinator.
     *
     * @param file              new coordinator image.
     * @param jsonAsCoordinator new coordinator details.
     * @return the new created coordinator.
     */
    Coordinator createNewCoordinator(MultipartFile file, JSONObject jsonAsCoordinator);

    /**
     * Updating coordinator details + image.
     *
     * @param file              the new image.
     * @param jsonAsCoordinator the new details.
     * @return updated coordinator details.
     */
    Coordinator updateCoordinator(MultipartFile file, JSONObject jsonAsCoordinator);

    /**
     * Updating coordinator details.
     *
     * @param coordinator the new details.
     * @return updated coordinator details.
     */
    Coordinator updateCoordinatorNoImage(Coordinator coordinator);

    /**
     * Getting all coordinators from the data-base.
     *
     * @return all coordinators from the data-base.
     */
    List<Coordinator> getAllCoordinators();

    /**
     * Deleting coordinator from the data-base.
     *
     * @param coordinatorId the deleted coordinator.
     * @return success operation message.
     */
    String deleteCoordinatorFromSystem(Long coordinatorId);

}

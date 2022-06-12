package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.repo.CoordinatorRepo;
import com.ab.shekelapp.service.interfaces.CoordinatorService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on coordinator type.
 */
@Service
public class CoordinatorServiceProvider implements CoordinatorService {

    /* For SQL queries on coordinator type */
    private final CoordinatorRepo coordinatorRepo;

    @Autowired
    public CoordinatorServiceProvider(CoordinatorRepo coordinatorRepo) {
        this.coordinatorRepo = coordinatorRepo;
    }

    @Override
    public Coordinator getCoordinator(long coordinatorId) {
        return findCoordinatorById(coordinatorId);
    }

    @Override
    public Coordinator getCoordinatorByUsername(String username) {
        return coordinatorRepo.findByUsername(username);
    }

    @Override
    public Coordinator createNewCoordinator(MultipartFile file, JSONObject jsonAsCoordinator) {
        /* For setting details from the provided json */
        Coordinator coordinator = new Coordinator();
        /* Setting details from the provided json */
        setCoordinatorDetails(coordinator, jsonAsCoordinator, false);
        /* Setting image from the provided file */
        coordinator.getShekelMember().setFileImage(file);
        /* Verifying that this is a new coordinator by resetting the ID to 0 */
        coordinator.setId(0L);
        /* Saving data of new coordinator in the data-base */
        return coordinatorRepo.save(coordinator);
    }

    @Override
    public Coordinator updateCoordinator(MultipartFile file, JSONObject jsonAsCoordinator) {
        /* For setting details from the provided json*/
        Coordinator coordinator = new Coordinator();
        /* Setting details from the provided json */
        setCoordinatorDetails(coordinator, jsonAsCoordinator, true);
        coordinator.checkAndSetEmptyFields(findCoordinatorById(coordinator.getId()).getShekelMember());
        /* Setting image from the provided file */
        coordinator.getShekelMember().setFileImage(file);
        /* Updating details in the data-base and returning the updated coordinator details */
        return coordinatorRepo.save(coordinator);
    }

    @Override
    public Coordinator updateCoordinatorNoImage(Coordinator coordinator) {
        /* Checking that the fields in the provided coordinator are not empty,
           if one of the fields is empty the function fills the field from info in the database */
        coordinator.checkAndSetEmptyFields(findCoordinatorById(coordinator.getId()).getShekelMember());
        /* Updating details in the data-base and returning the updated coordinator details */
        return coordinatorRepo.saveAndFlush(coordinator);
    }

    @Override
    public List<Coordinator> getAllCoordinators() {
        /* Returning the data of all coordinators in the system */
        return coordinatorRepo.findAll();
    }

    @Override
    public String deleteCoordinatorFromSystem(Long coordinatorId) {
        /* Getting coordinator from system */
        Coordinator coordinator = findCoordinatorById(coordinatorId);
        /* Removing all apartments from coordinator apartments list */
        coordinator.setApartments(null);
        /* Deleting coordinator from the data-base */
        coordinatorRepo.delete(coordinator);
        /* 'coordinator ...(coordinator name) is deleted from the system' */
        return coordinator.getShekelMember().getFirstName() + " " + coordinator.getShekelMember()
                .getLastName() + " נמחק מהמערכת ";
    }

    // Help function:

    /**
     * A function for extracting new/updated coordinator details from a json object
     * and setting them in the coordinator object (for when creating a new coordinator/updating coordinator
     * details + image).
     *
     * @param coordinator       the set the details to.
     * @param jsonAsCoordinator to get details from.
     * @param update            for checking which details needs to be extracted form the json object.
     */
    private void setCoordinatorDetails(Coordinator coordinator, JSONObject jsonAsCoordinator, boolean update) {
        try {
            if (update) {
                coordinator.setId(Integer.toUnsignedLong((Integer) jsonAsCoordinator.get("id")));
            }

            coordinator.setShekelMember(new ShekelMember());
            JSONObject shekelMember = jsonAsCoordinator.getJSONObject("shekelMember");
            coordinator.getShekelMember().setFirstName((String) shekelMember.get("firstName"));
            coordinator.getShekelMember().setLastName((String) shekelMember.get(("lastName")));
            coordinator.setUsername((String) jsonAsCoordinator.get(("username")));
            coordinator.getShekelMember().setPhoneNumber((String) shekelMember.get(("phoneNumber")));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * A function for getting coordinator details from the data-base by id
     * (a function only for the class for avoiding code duplication).
     *
     * @param coordinatorId of the requested coordinator.
     * @return the requested coordinator.
     */
    private Coordinator findCoordinatorById(Long coordinatorId) {
        return coordinatorRepo.findById(coordinatorId)
                /* 'no coordinator with provided details in the system ' */
                .orElseThrow(() -> new NoSuchElementException("אין רכז.ת עם הנתונים שסופקו במערכת"));
    }

}

package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.service.ex.ConflictException;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the apartment data-source.
 */
public interface ApartmentService {

    /**
     * Getting apartment details by id.
     *
     * @param apartmentId of the requested apartment.
     * @return the requested apartment.
     */
    Apartment getApartmentByApartmentId(long apartmentId);

    /**
     * Creating new apartment.
     *
     * @param file            new apartment image.
     * @param jsonAsApartment new apartment details.
     * @return the new created apartment.
     */
    Apartment createNewApartment(MultipartFile file, JSONObject jsonAsApartment);

    /**
     * Updating apartment details + image.
     *
     * @param file            the new image.
     * @param jsonAsApartment the new details.
     * @return updated apartment details.
     */
    Apartment updateApartmentDetails(MultipartFile file, JSONObject jsonAsApartment);

    /**
     * Updating apartment details.
     *
     * @param apartment the new details.
     * @return updated apartment details.
     */
    Apartment updateApartmentDetailsNoImage(Apartment apartment);

    /**
     * Adding guide from system to apartment guides list.
     *
     * @param guide       the added guide.
     * @param apartmentId apartment to add guide to.
     * @param coordinator if user that adding is coordinator type , for checking if apartment is a part
     *                    of the coordinator's apartments list.
     * @return the apartment that guide is added to (is used when user type admin is performing the operation).
     * @throws ConflictException if user is coordinator type and apartment doesn't belong to him/her.
     */
    Apartment addGuideToApartmentGuidesList(Guide guide, long apartmentId, Coordinator coordinator) throws ConflictException;

    /**
     * Adding apartment from system to coordinator's apartments list.
     *
     * @param apartmentId apartment to add.
     * @param coordinator to add apartment to.
     * @return the added apartment.
     */
    Apartment addApartmentToCoordinatorApartmentList(Long apartmentId, Coordinator coordinator);

    /**
     * Getting all apartments from the data-base.
     *
     * @return all apartments from the data-base.
     */
    List<Apartment> getAllApartments();

    /**
     * Getting all apartments where coordinator field is null from the data-base.
     *
     * @return all apartments with no coordinator from the data-base.
     */
    List<Apartment> getAllApartmentsNoCoordinator();

    /**
     * Getting all coordinator apartments from the data-base.
     *
     * @param coordinatorId for getting coordinator's apartments.
     * @return coordinator's apartments list.
     */
    List<Apartment> getAllCoordinatorApartments(Long coordinatorId);

    /**
     * Getting tenant's apartment name.
     *
     * @param tenantId for getting the name of the apartment.
     * @return tenant's apartment name.
     */
    String findTenantApartmentName(Long tenantId);

    /**
     * Removing apartment from coordinator's apartments list (when coordinator is removing apartment
     * from the apartments list or when admin is deleting coordinator from the system).
     *
     * @param apartmentId                 the removed apartment.
     * @param coordinatorApartmentsIdList all coordinator's apartments id.
     * @return success operation message.
     * @throws NoSuchFieldException if can't find apartment in coordinator's apartments list.
     */
    String removeApartmentFromCoordinatorApartmentsList(long apartmentId, List<Long> coordinatorApartmentsIdList) throws NoSuchFieldException;

    /**
     * Deleting apartment from the data-base.
     *
     * @param apartmentId the deleted apartment.
     * @return success operation message.
     */
    String removeApartmentFromSystem(long apartmentId);

    /**
     * Removing guide from apartment guides list.
     *
     * @param apartmentId the apartment to remove guide from.
     * @param guide       the removed guide.
     */
    void removeGuideFromApartment(Long apartmentId, Guide guide);

}

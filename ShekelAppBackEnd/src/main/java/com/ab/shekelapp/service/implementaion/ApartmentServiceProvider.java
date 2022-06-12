package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.repo.ApartmentRepo;
import com.ab.shekelapp.service.ex.ConflictException;
import com.ab.shekelapp.service.interfaces.ApartmentService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on apartment type.
 */
@Service
public class ApartmentServiceProvider implements ApartmentService {

    /* For SQL queries on apartment type */
    private final ApartmentRepo apartmentRepo;

    @Autowired
    public ApartmentServiceProvider(ApartmentRepo apartmentRepo) {
        this.apartmentRepo = apartmentRepo;
    }

    @Override
    public Apartment getApartmentByApartmentId(long apartmentId) {
        return getApartmentById(apartmentId);
    }

    @Override
    public Apartment createNewApartment(MultipartFile file, JSONObject jsonAsApartment) {
        /* For setting details from the provided json */
        Apartment apartment = new Apartment();
        /* Setting details from the provided json */
        setApartmentDetails(apartment, jsonAsApartment, false);
        /* Setting image from the provided file */
        setApartmentImage(file, apartment);
        /* Verifying that this is a new apartment by resetting the ID to 0 */
        apartment.setId(0);
        /* Saving data of new apartment in the data-base */
        return apartmentRepo.save(apartment);
    }

    @Override
    public Apartment updateApartmentDetails(MultipartFile file, JSONObject jsonAsApartment) {
        /* For setting details from the provided json */
        Apartment apartment = new Apartment();
        /* Setting details from the provided json */
        setApartmentDetails(apartment, jsonAsApartment, true);
        /* Setting image from the provided file */
        setApartmentImage(file, apartment);
        /* Updating details in the data-base and returning the updated apartment details */
        return apartmentRepo.saveAndFlush(apartment);
    }

    @Override
    public Apartment updateApartmentDetailsNoImage(Apartment apartment) {
        /* getting apartment from data-base */
        Apartment systemApartment = getApartmentById(apartment.getId());
        /* Checking that the fields in the provided apartment are not empty,
           if one of the fields is empty the function fills the field from info in the database */
        checkAndSetEmptyFields(apartment, systemApartment);
        /* Setting apartment's guides list */
        apartment.setGuides(systemApartment.getGuides());
        /* Updating details in the data-base and returning the updated apartment details */
        return apartmentRepo.save(apartment);
    }

    @Override
    public Apartment addGuideToApartmentGuidesList(Guide guide, long apartmentId, Coordinator coordinator) throws ConflictException {
        /* Getting apartment from system */
        Apartment apartment = getApartmentById(apartmentId);
        /* Operation can be performed admin/coordinator, coordinator can add guide only to one
           of his apartments,so checking kind of user */
        if (coordinator != null) {
            /* If user is coordinator type, checking that apartment belongs to coordinator */
            checkIfApartmentBelongToCoordinator(apartmentId, coordinator);
        }
        /* Adding guide to apartment */
        apartment.getGuides().add(guide);
        /* Updating apartment with the new guide */
        return apartmentRepo.save(apartment);
    }

    @Override
    public Apartment addApartmentToCoordinatorApartmentList(Long apartmentId, Coordinator coordinator) {
        /* Getting apartment from system */
        Apartment apartment = getApartmentById(apartmentId);
        /* Attaching coordinator to apartment */
        apartment.setCoordinator(coordinator);
        /* Updating apartment with the new coordinator */
        return apartmentRepo.save(apartment);
    }

    @Override
    public List<Apartment> getAllApartments() {
        /* Returning the data of all apartments in the system */
        return apartmentRepo.findAll();
    }

    @Override
    public List<Apartment> getAllApartmentsNoCoordinator() {
        /* Returning the data of all apartments where coordinator field = null in the system */
        return apartmentRepo.findByCoordinatorIsNull();
    }

    @Override
    public List<Apartment> getAllCoordinatorApartments(Long coordinatorId) {
        /* Returning the data of all coordinator's apartments in the system*/
        return apartmentRepo.findAllByCoordinatorId(coordinatorId);
    }

    @Override
    public String findTenantApartmentName(Long tenantId) {
        /* Returning  tenant's apartment name */
        return apartmentRepo.findApartmentNameByTenantId(tenantId);
    }

    @Override
    public String removeApartmentFromCoordinatorApartmentsList(
            long apartmentId, List<Long> apartmentsIdsList) throws NoSuchFieldException {
        /* Getting apartment from system */
        Apartment apartment = getApartmentById(apartmentId);
        /* For success/exception message */
        String coordinatorName = apartment.getCoordinator().getShekelMember().getFirstName();
        /* Checking that apartment belongs to coordinator */
        if (apartmentsIdsList.stream().noneMatch(id -> id == apartmentId)) {
            /* 'apartment is not a part of ...(coordinator's name) apartments list' */
            throw new NoSuchFieldException("דירה לא חלק מרשימת הדירות של " + coordinatorName);
        }
        /* Removing apartment from coordinator's apartments list */
        apartment.setCoordinator(null);
        /* Setting apartment coordinator filed in the data-base as null */
        apartmentRepo.save(apartment);
        /* 'apartment ...(apartment name) is removed from ...(coordinator name) apartment's list' */
        return "הדירה " + apartment.getName() + " נמחקה מרשימת הדירות של " + coordinatorName;
    }

    @Override
    public String removeApartmentFromSystem(long apartmentId) {
        /* Getting apartment from system */
        Apartment apartment = getApartmentById(apartmentId);
        /* For success operation message */
        String apartmentName = apartment.getName();
        /* Removing guides from apartment guides list */
        apartment.setGuides(null);
        /* Removing tenants from apartment tenants list */
        apartment.setTenants(null);
        /* Removing apartment from coordinator's apartments list */
        apartment.setCoordinator(null);
        /* Deleting apartment from the data-base */
        apartmentRepo.delete(apartment);
        /* 'apartment ...(apartment name) is deleted from the system' */
        return "הדירה " + apartmentName + " נמחקה מהמערכת";
    }

    @Override
    public void removeGuideFromApartment(Long apartmentId, Guide guide) {
        /* Getting apartment from system */
        Apartment apartment = getApartmentById(apartmentId);
        /* Checking if guide is a part of apartment guides list */
        apartment.getGuides()
                .stream()
                .filter(apartmentGuide -> apartmentGuide.getId().equals(guide.getId()))
                .findFirst()
                .orElseThrow(
                        /* '...(guide's name) is not a part of apartment's guides list' */
                        () -> new NoSuchElementException(
                                guide.getShekelMember().getFirstName() + " לא חלק מרשימת המדרכים של הדירה "));
        /* Removing guide from apartment guides list */
        apartment.getGuides().remove(guide);
        /* Updating apartment without the removed guide */
        apartmentRepo.save(apartment);
    }

    // Help functions:

    /**
     * A function for getting the bates from file and setting it as apartment image byte array.
     *
     * @param file      the image file.
     * @param apartment the apartment to set the image byte array.
     */
    private void setApartmentImage(MultipartFile file, Apartment apartment) {
        try {
            Byte[] byteObjects = new Byte[file.getBytes().length];

            int i = 0;

            for (byte b : file.getBytes()) {
                byteObjects[i++] = b;
            }
            apartment.setImage(byteObjects);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * A function for checking if a apartment is a part of coordinator's apartments list
     * (before performing any actions an the apartment).
     *
     * @param apartmentId of the apartment to check.
     * @param coordinator to check if apartment is a part of the apartments list.
     * @throws ConflictException in case apartment doesn't belong to coordinator.
     */
    private void checkIfApartmentBelongToCoordinator(Long apartmentId, Coordinator coordinator) throws ConflictException {
        coordinator.getApartments()
                .stream()
                .filter(apartment -> apartment.getId() == apartmentId)
                .findFirst()
                /* 'apartment is not a part of ...(coordinator's name) apartments list' */
                .orElseThrow(() -> new ConflictException(" דירה לא חלק מרשימת הדירות של " + coordinator.getShekelMember()
                        .getFirstName() + " " + coordinator.getShekelMember().getLastName()));
    }

    /**
     * A function for extracting new/updated apartment details from a json object
     * and setting them in the apartment object (for when creating a new apartment/updating apartment
     * details + image).
     *
     * @param apartment       the set the details to.
     * @param jsonAsApartment to get details from.
     * @param update          for checking which details needs to be extracted form the json object.
     */
    private void setApartmentDetails(Apartment apartment, JSONObject jsonAsApartment, boolean update) {
        try {
            Integer apartmentId;

            String apartmentName = (String) jsonAsApartment.get("name");
            apartment.setName(apartmentName);
            apartment.setPhoneNumber((String) jsonAsApartment.get("phoneNumber"));
            apartment.setAddress(String.valueOf(jsonAsApartment.get("address")));
            if (update) {
                apartmentId = (Integer) jsonAsApartment.get("id");
                Apartment systemApartment = getApartmentById(Integer.toUnsignedLong(apartmentId));
                checkAndSetEmptyFields(apartment, systemApartment);
                apartment.setCoordinator(systemApartment.getCoordinator());
                apartment.setGuides(systemApartment.getGuides());
                apartment.setId(apartmentId);
                apartment.setGender(systemApartment.getGender());
            } else {
                String gender = jsonAsApartment.getString("gender");
                if (gender.equals(ApartmentsAndTenantsGender.BOYS.toString())) {
                    apartment.setGender(ApartmentsAndTenantsGender.BOYS);
                } else {
                    apartment.setGender(ApartmentsAndTenantsGender.GIRLS);
                }
            }
        } catch (JSONException ignore) { /* Ignored */ }
    }

    /**
     * When coordinator wants to update apartment data, the function checks if one the updated
     * fields is empty and if so the function fills the field with the data from the data-base.
     *
     * @param apartment       The checked apartment body.
     * @param systemApartment for filling fields in case there are empty.
     */
    private void checkAndSetEmptyFields(Apartment apartment, Apartment systemApartment) {
        if (apartment.getName() == null || apartment.getName().equals("")) {
            apartment.setName(systemApartment.getName());
        }

        if (apartment.getAddress() == null || apartment.getAddress().equals("")) {
            apartment.setAddress(systemApartment.getAddress());
        }

        if (apartment.getPhoneNumber() == null || apartment.getPhoneNumber().equals("")) {
            apartment.setPhoneNumber(systemApartment.getPhoneNumber());
        }
    }

    /**
     * A function for getting apartment details from the data-base by id
     * (a function only for the class for avoiding code duplication).
     *
     * @param apartmentId of the requested apartment.
     * @return the requested apartment.
     */
    private Apartment getApartmentById(Long apartmentId) {
        return apartmentRepo.findById(apartmentId)
                /* 'no apartment with the provided data in the system' */
                .orElseThrow(() -> new NoSuchElementException("אין דירה עם הנתונים שסופקו במערכת"));
    }

}

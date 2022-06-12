package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.entity.general.ShekelMember;
import com.ab.shekelapp.repo.TenantRepo;
import com.ab.shekelapp.service.ex.ConflictException;
import com.ab.shekelapp.service.interfaces.TenantService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * The class is responsible for all actions performed on tenant type.
 */
@Service
public class TenantServiceProvider implements TenantService {
    /* For SQL queries on tenant type */
    private final TenantRepo tenantRepo;

    private static final int BIRTH_DAY_LAST_CHAR = 10;

    @Autowired
    public TenantServiceProvider(TenantRepo tenantRepo) {
        this.tenantRepo = tenantRepo;
    }

    @Override
    public Tenant getTenant(long tenantId) {
        return getTenantById(tenantId);
    }

    @Override
    public Tenant createTenant(MultipartFile file, JSONObject jsonAsTenant) {
        /* For setting details from the provided json */
        Tenant tenant = new Tenant();
        tenant.setShekelMember(new ShekelMember());
        /* Setting details from the provided json */
        setTenantDetails(tenant, jsonAsTenant, false);
        /* Setting image from the provided file */
        tenant.getShekelMember().setFileImage(file);
        /* Verifying that this is a new tenant by resetting the ID to 0 */
        tenant.setId(0);
        /* Saving data of new tenant in the data-base */
        return tenantRepo.save(tenant);
    }

    @Override
    public Tenant updateTenant(MultipartFile file, JSONObject jsonAsTenant) {
        /* For setting details from the provided json */
        Tenant tenant = new Tenant();
        /* Setting details from the provided json */
        setTenantDetails(tenant, jsonAsTenant, true);
        /* Setting image from the provided file */
        tenant.getShekelMember().setFileImage(file);
        /* Updating details in the data-base and returning the updated tenant details */
        return tenantRepo.save(tenant);
    }

    @Override
    public Tenant updateTenantNoImage(Tenant tenant) {
        /* Getting tenant details from data-base */
        Tenant systemTenant = getTenantById(tenant.getId());
        /* Checking that the fields in the provided apartment are not empty,
         * If one of the fields is empty the function fills the field from info in the database */
        checkAndSetEmptyAndOtherFields(tenant, systemTenant);
        /* Updating details in the data-base and returning the updated tenant details */
        return tenantRepo.save(tenant);
    }

    @Override
    public Tenant addTenantToApartment(Apartment apartment, Long tenantId) throws ConflictException {
        /* Getting tenant details from data-base */
        Tenant tenant = getTenantById(tenantId);
        /* Checking if tenant is registered is apartment in the data-base */
        if (tenant.getApartment() != null) {
            /* 'tenant is registered in a apartment in the system' */
            throw new ConflictException("דייר.ת כבר רשומ.ה בדירה במערכת");
        }

        /* Checking if apartment's and tenant's gender are the same */
        if (!apartment.getGender().equals(tenant.getShekelMember().getGender())) {
            /* 'apartment and tenant gender don't match' */
            throw new ConflictException("המגדר של הדירה ושל הדייר.ת לא תואמים");
        }

        /* Adding tenant to apartment tenant list */
        tenant.setApartment(apartment);

        /* Updating tenant details with the apartment and returning the tenant details */
        return tenantRepo.save(tenant);
    }

    @Override
    public List<Tenant> getAllTenants() {
        /* Returning the data of all tenant in the system */
        return tenantRepo.findAll();
    }

    @Override
    public List<Tenant> getAllTenantsWithNoApartment() {
        /* Returning the data of all tenants with no apartment in the system */
        return tenantRepo.findByApartmentIsNull();
    }

    @Override
    public List<Tenant> getCoordinatorTenants(Coordinator coordinator) {
        /* For collecting coordinator's tenants */
        List<Tenant> tenants = new ArrayList<>();
        /* Collecting coordinator's tenants */
        coordinator.getApartments().forEach(apartment -> tenants.addAll(apartment.getTenants()));
        /* Returning coordinator's tenants list */
        return tenants;
    }

    @Override
    public String removeTenantFromApartment(Coordinator coordinator, Long tenantId) throws ConflictException {
        /* Getting tenant details from data-base */
        Tenant tenant = getTenantById(tenantId);
        /* For checking if tenant is from one of coordinator's apartments */
        long apartmentId = 0L;
        String apartmentName = "";
        /* Checking if tenant is from one of coordinator's apartments */
        for (Apartment apartment : coordinator.getApartments()) {
            for (Tenant apartmentTenant : apartment.getTenants()) {
                if (tenant.getId() == apartmentTenant.getId()) {
                    apartmentId = apartment.getId();
                    apartmentName = apartment.getName();
                    break;
                }
            }
        }

        /* If not */
        if (apartmentId == 0) {
            /* 'tenant is not a part of ...(coordinator's name) list of tenants' */
            throw new ConflictException("דייר.ת לא חלק מרשימת הדיירים של  " + coordinator
                    .getShekelMember().getFirstName());
        }
        /* Removing tenant from apartment */
        resetTenantApartmentAndUpdate(tenant);
        /* '...(tenant name) is removed from ...(apartment name)' */
        return tenant.getShekelMember().getFirstName() + " " + " הוסר.ה מדירת " + apartmentName;
    }

    @Override
    public String deleteTenantFromSystem(Long tenantId) {
        /* Getting tenant details from data-base */
        Tenant tenant = getTenantById(tenantId);
        /* Resetting apartment field*/
        tenant.setApartment(null);
        /* Deleting tenant from system */
        tenantRepo.delete(tenant);
        /* '...(tenant name) is deleted from the system' */
        return tenant.getShekelMember().getFirstName() + " " + tenant.getShekelMember()
                .getLastName() + "הוסר.ה מהמערכת";
    }

    @Override
    public void setTenantApartmentNullBeforeRemovingApartment(List<Tenant> tenants) {
        /* Running on all apartment to delete */
        for (Tenant tenant : tenants) {
            /* Removing tenant from apartment */
            resetTenantApartmentAndUpdate(tenant);
        }
    }

    // Help functions:

    /**
     * A function for extracting new/updated tenant details from a json object
     * and setting them in the tenant object (for when creating a new tenant/updating tenant
     * details + image).
     *
     * @param tenant       the set the details to.
     * @param jsonAsTenant to get details from.
     * @param update       for checking which details needs to be extracted form the json object.
     */
    private void setTenantDetails(Tenant tenant, JSONObject jsonAsTenant, boolean update) {

        try {
            JSONObject shekelMember = jsonAsTenant.getJSONObject("shekelMember");
            tenant.setShekelMember(new ShekelMember());
            tenant.getShekelMember().setFirstName((String) shekelMember.get("firstName"));
            tenant.getShekelMember().setLastName((String) shekelMember.get(("lastName")));
            tenant.getShekelMember().setPhoneNumber((String) shekelMember.get(("phoneNumber")));

            tenant.setDescription((String) jsonAsTenant.get("description"));
            tenant.setWorkPlace((String) jsonAsTenant.get("workPlace"));

            String birthDay = String.valueOf(jsonAsTenant.get("birthDay"))
                    .replace("[", "")
                    .substring(0, BIRTH_DAY_LAST_CHAR)
                    .replace(",", "-");
            tenant.setBirthDay(LocalDate.parse(birthDay.substring(0, BIRTH_DAY_LAST_CHAR)));

            if (update) {
                long tenantId = jsonAsTenant.getLong("id");
                tenant.setId(tenantId);
                Tenant systemTenant = getTenantById(tenantId);
                tenant.setApartment(systemTenant.getApartment());
                tenant.setMedicines(systemTenant.getMedicines());
                tenant.setChores(systemTenant.getChores());
            } else {
                String gender = (String) shekelMember.get("gender");
                if (gender.equals(ApartmentsAndTenantsGender.BOYS.toString())) {
                    tenant.getShekelMember().setGender(ApartmentsAndTenantsGender.BOYS);
                } else {
                    tenant.getShekelMember().setGender(ApartmentsAndTenantsGender.GIRLS);
                }
            }

        } catch (JSONException ignore) {
        }

    }

    /**
     * When coordinator wants to update tenant data, the function checks if one the updated
     * fields is empty and if so the function fills the field with the data from the data-base.
     *
     * @param tenant       The checked tenant body.
     * @param systemTenant for filling fields in case there are empty.
     */
    private void checkAndSetEmptyAndOtherFields(Tenant tenant, Tenant systemTenant) {
        ShekelMember tenantShekelMember = tenant.getShekelMember();
        ShekelMember systemTenantShekelMember = systemTenant.getShekelMember();

        if (tenantShekelMember.getFirstName() == null || tenantShekelMember.getFirstName().equals("")) {
            tenantShekelMember.setFirstName(systemTenantShekelMember.getFirstName());
        }

        if (tenantShekelMember.getLastName() == null || tenantShekelMember.getLastName().equals("")) {
            tenantShekelMember.setLastName(systemTenantShekelMember.getLastName());
        }

        if (tenantShekelMember.getPhoneNumber() == null || tenantShekelMember.getPhoneNumber().equals("")) {
            tenantShekelMember.setPhoneNumber(systemTenantShekelMember.getPhoneNumber());
        }

        if (tenant.getWorkPlace() == null || tenant.getWorkPlace().equals("")) {
            tenant.setWorkPlace(systemTenant.getWorkPlace());
        }

        if (tenant.getDescription() == null || tenant.getDescription().equals("")) {
            tenant.setDescription(systemTenant.getDescription());
        }

        tenantShekelMember.setGender(systemTenantShekelMember.getGender());

        tenant.setApartment(systemTenant.getApartment());

        tenant.setMedicines(systemTenant.getMedicines());

    }

    /**
     * A function for getting tenant details from the data-base by id
     * (a function only for the class for avoiding code duplication).
     *
     * @param tenantId of the requested tenant.
     * @return the requested tenant.
     */
    private Tenant getTenantById(Long tenantId) {
        return tenantRepo.findById(tenantId)
                /* 'no tenant with provided details in the system ' */
                .orElseThrow(() -> new NoSuchElementException("אין דייר.ת עם הנתונים שהוצגו במערכת"));
    }

    /**
     * A function for Resetting tenant's apartment field in the date-base.
     *
     * @param tenant the tenant to update.
     */
    private void resetTenantApartmentAndUpdate(Tenant tenant) {
        /* Removing tenant from apartment */
        tenant.setApartment(null);
        /* Updating tenant in the data-base */
        tenantRepo.save(tenant);
    }

}

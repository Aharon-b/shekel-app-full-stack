package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Apartment;
import com.ab.shekelapp.entity.Coordinator;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.service.ex.ConflictException;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the tenant data-source.
 */
public interface TenantService {

    /**
     * Getting tenant details by id.
     *
     * @param tenantId of the requested tenant.
     * @return the requested tenant.
     */
    Tenant getTenant(long tenantId);

    /**
     * Creating new tenant.
     *
     * @param file         new tenant's image.
     * @param jsonAsTenant new tenant's details.
     * @return the new created tenant.
     */
    Tenant createTenant(MultipartFile file, JSONObject jsonAsTenant);

    /**
     * Updating tenant details + image.
     *
     * @param file         the new image.
     * @param jsonAsTenant the new details.
     * @return updated tenant details.
     */
    Tenant updateTenant(MultipartFile file, JSONObject jsonAsTenant);

    /**
     * Updating tenant details.
     *
     * @param tenant the new details.
     * @return updated tenant details.
     */
    Tenant updateTenantNoImage(Tenant tenant);

    /**
     * Adding tenant to apartment's tenants list.
     *
     * @param apartment to add tenant to apartment's tenants list.
     * @param tenantId  the added tenant.
     * @return the added tenant.
     * @throws ConflictException if tenant is already in a apartment in the system
     *                           /tenant's and apartment gender are not the same.
     */
    Tenant addTenantToApartment(Apartment apartment, Long tenantId) throws ConflictException;

    /**
     * Getting all tenants from the data-base.
     *
     * @return all tenants from the data-base.
     */
    List<Tenant> getAllTenants();

    /**
     * Getting all tenants with no apartment.
     *
     * @return list of all tenants with no apartment.
     */
    List<Tenant> getAllTenantsWithNoApartment();

    /**
     * Getting all coordinator's tenants list.
     *
     * @param coordinator for getting all coordinator's apartments tenants.
     * @return list of coordinator's tenants.
     */
    List<Tenant> getCoordinatorTenants(Coordinator coordinator);

    /**
     * Removing tenant from apartment.
     *
     * @param coordinator for checking if tenant is a part of coordinator's apartments tenants list.
     * @param tenantId    the removed tenant.
     * @return success operation message.
     * @throws ConflictException if tenant is not a part of coordinator's apartments tenants list.
     */
    String removeTenantFromApartment(Coordinator coordinator, Long tenantId) throws ConflictException;

    /**
     * Deleting tenant from the data-base.
     *
     * @param tenantId the deleted tenant.
     * @return success operation message.
     */
    String deleteTenantFromSystem(Long tenantId) throws NoSuchFieldException;

    /**
     * Resting apartment tenants apartment field before deleting apartment from the data-base.
     *
     * @param tenants deleted apartment tenants.
     */
    void setTenantApartmentNullBeforeRemovingApartment(List<Tenant> tenants);

}


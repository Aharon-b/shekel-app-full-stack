package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.annotation.Nonnull;
import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular tenant.
 */
public interface TenantRepo extends JpaRepository<Tenant, Long> {
    /**
     * The function is responsible for returning all of the tenants names and phone numbers
     * from the data-base.
     *
     * @return list of all the tenants.
     */
    @Query(value = "select * , first_name from tenant", nativeQuery = true)
    @Nonnull
    List<Tenant> findAll();

    /**
     * A function for all tenants with no apartment.
     *
     * @return all tenants with no apartment.
     */
    @Query(value = "select * , first_name , phone_number from tenant where apartment_id is null", nativeQuery = true)
    List<Tenant> findByApartmentIsNull();

}

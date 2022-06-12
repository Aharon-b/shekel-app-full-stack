package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular apartment.
 */
public interface ApartmentRepo extends JpaRepository<Apartment, Long> {

    /**
     * A function for getting all apartments with no coordinator.
     *
     * @return all apartments with no coordinator.
     */
    @Query(value = "select * , name , phone_number from apartment where coordinator_id is null", nativeQuery = true)
    List<Apartment> findByCoordinatorIsNull();

    /**
     * A function for all coordinator apartments names.
     *
     * @param coordinatorId of the coordinator.
     * @return coordinator apartments names.
     */
    @Query(value = "select * , name from apartment where coordinator_id=:coordinatorId", nativeQuery = true)
    List<Apartment> findAllByCoordinatorId(Long coordinatorId);

    /**
     * A function for tenant's apartment name.
     *
     * @param tenantId of the tenant.
     * @return tenant's apartment name.
     */
    @Query(value = "select name from apartment a inner join tenant t on t.apartment_id = a.id\n" +
            "where t.id =:tenantId", nativeQuery = true)
    String findApartmentNameByTenantId(Long tenantId);

}

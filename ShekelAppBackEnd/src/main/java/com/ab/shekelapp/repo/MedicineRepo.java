package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular medicine.
 */
public interface MedicineRepo extends JpaRepository<Medicine, Long> {
    /**
     * The function is responsible for returning tenant's medicine list.
     *
     * @param tenantId for getting the list .
     * @return tenant's medicine list.
     */
    List<Medicine> findAllByTenantId(Long tenantId);

}

package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Chore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular chore.
 */
public interface ChoreRepo extends JpaRepository<Chore, Long> {
    /**
     * The function is responsible for returning tenant's chores list.
     *
     * @param tenantId for getting the list .
     * @return tenant's chores list.
     */
    List<Chore> findAllByTenantId(Long tenantId);

}

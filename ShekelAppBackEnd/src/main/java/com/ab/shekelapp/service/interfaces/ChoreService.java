package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Chore;
import com.ab.shekelapp.entity.Tenant;

import java.util.List;

/**
 * This interface is used to define a Data Access Object for the chore data-source.
 */
public interface ChoreService {

    /**
     * A function for creating a new chore in the data-base.
     *
     * @param chore  the new chore.
     * @param tenant for attaching the new chore to tenant chores list.
     * @return the new created chore.
     */
    Chore createChore(Chore chore, Tenant tenant);

    /**
     * A function for updating chore details in the data-base.
     *
     * @param chore the updated chore details.
     * @return chore with updated details.
     */
    Chore updateChore(Chore chore);

    /**
     * A function for getting tenant's chores list from the data-base.
     *
     * @param tenantId of the requested tenant for the chores list.
     * @return tenant's chores list.
     */
    List<Chore> getTenantChores(long tenantId);

    /**
     * A function for deleting chore from the data-base.
     *
     * @param chore the deleted chore.
     * @return success operation message.
     */
    String removeChore(Chore chore);

}

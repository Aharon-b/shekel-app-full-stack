package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.entity.Chore;
import com.ab.shekelapp.entity.Tenant;
import com.ab.shekelapp.repo.ChoreRepo;
import com.ab.shekelapp.service.interfaces.ChoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * The class is responsible for all actions performed on chore type.
 */
@Service
public class ChoreServiceProvider implements ChoreService {

    /* For SQL queries on chore type */
    private final ChoreRepo choreRepo;

    @Autowired
    public ChoreServiceProvider(ChoreRepo choreRepo) {
        this.choreRepo = choreRepo;
    }

    @Override
    public Chore createChore(Chore chore, Tenant tenant) {
        /* Attaching the created chore to a tenant from the data-base */
        chore.setTenant(tenant);
        /* Verifying that this is a new chore by resetting the ID to 0 */
        chore.setId(0);
        /* Saving data of new chore in the data-base */
        return choreRepo.save(chore);
    }

    @Override
    public Chore updateChore(Chore chore) {
        /* Attaching the updated chore to the tenant that chore belongs to */
        chore.setTenant(choreRepo.findById(chore.getId()).orElseThrow().getTenant());
        /* Updating details in the data-base and returning the updated chore details */
        return choreRepo.save(chore);
    }

    @Override
    public List<Chore> getTenantChores(long tenantId) {
        /* Returning the data of all tenant's chores in the system*/
        return choreRepo.findAllByTenantId(tenantId);
    }

    @Override
    public String removeChore(Chore chore) {
        /* Deleting chore from the data-base */
        choreRepo.delete(chore);
        /* 'chore is deleted from the system' */
        return "המטלה נמחקה מהמערכת";
    }

}

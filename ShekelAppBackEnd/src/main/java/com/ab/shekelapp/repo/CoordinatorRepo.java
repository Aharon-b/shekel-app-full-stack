package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Coordinator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.annotation.Nonnull;
import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular coordinator.
 */
public interface CoordinatorRepo extends JpaRepository<Coordinator, Long> {
    /**
     * The function is responsible for returning a coordinator from the data-base
     * by username.
     *
     * @param username of the requested coordinator.
     * @return the requested coordinator.
     */
    Coordinator findByUsername(String username);

    /**
     * A function for getting all coordinators details.
     *
     * @return all coordinators.
     */
    @Query(value = "select * , first_name , last_name , phone_number from coordinator", nativeQuery = true)
    @Nonnull
    List<Coordinator> findAll();

}

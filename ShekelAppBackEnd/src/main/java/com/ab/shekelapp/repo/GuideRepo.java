package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular guide.
 */
public interface GuideRepo extends JpaRepository<Guide, Long> {
    /**
     * The function is responsible for returning a guide from the data-base
     * by username.
     *
     * @param username of the requested width-guide.
     * @return the requested guide.
     */
    Guide findByUsername(String username);

}

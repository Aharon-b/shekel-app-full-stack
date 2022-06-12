package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.WidthGuide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular width-guide.
 */
public interface WidthGuideRepo extends JpaRepository<WidthGuide, Long> {
    /**
     * The function is responsible for returning a width-guide from the data-base
     * by username.
     *
     * @param username of the requested width-guide.
     * @return the requested width-guide.
     */
    Optional<WidthGuide> findByUsername(String username);

}

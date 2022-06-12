package com.ab.shekelapp.repo;

import com.ab.shekelapp.entity.replacements.Replacement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * The interface gives all the common SQL requests and in addition helps
 * to create required SQL requests for information about a particular replacement.
 */
public interface ReplacementRepo extends JpaRepository<Replacement, Long> {
    /**
     * The function is responsible for returning all guide replacements from the data-base.
     *
     * @param guideId of the guide.
     * @return all guide's replacements.
     */
    List<Replacement> findAllByGuideId(Long guideId);

    /**
     * The function is responsible for returning all replacement requests with the same
     * apartment id from the data-base.
     *
     * @param apartmentId of the apartment.
     * @return all replacement requests with the provided apartment id.
     */
    List<Replacement> findAllByApartmentId(Long apartmentId);

}

package com.ab.shekelapp.service.interfaces;

import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.ab.shekelapp.service.ex.ConflictException;

import java.util.HashMap;
import java.util.List;

/**
 * This interface is used to define a Data Access Object for the replacement data-source.
 */
public interface ReplacementService {

    /**
     * Creating a new replacement request/offer.
     *
     * @param guide       that created the replacement.
     * @param replacement to create.
     * @return the created replacement.
     * @throws ConflictException if guide has other replacement with shift times that overlap,
     *                           or if the replacement is a request type and there is anther request
     *                           with the same apartment and the shift times overlap.
     */
    Replacement createReplacement(Guide guide, Replacement replacement) throws ConflictException;

    /**
     * Getting all replacements request that are not guide's requests.
     *
     * @param guide to find all requests that doesn't belong to guide.
     * @return all requests that doesn't belong to guide.
     */
    List<Replacement> getAllNotGuide_sRequests(Guide guide);

    /**
     * Getting all guide's approved replacements offers (replacement InApprovedProc = approved).
     *
     * @param guideId to find all guide's approved offers.
     * @return all guide's approved offers.
     */
    List<Replacement> getGuideReplacementApprovedOffers(Long guideId);

    /**
     * Getting all guide's replacements (replacement InApprovedProc = no).
     *
     * @param guideId to find all guide's replacements.
     * @return all guide's replacements.
     */
    List<Replacement> getAllGuideReplacementsRequestsAndOffers(Long guideId);

    /**
     * When deleting apartment from system this function is called for
     * deleting all requests with apartment.
     *
     * @param apartmentId to find all requests with apartment.
     * @return all requests with apartment.
     */
    List<Replacement> getAllWithApartmentId(Long apartmentId);

    /**
     * Getting all requests that the shift times overlaps with the offer shift times.
     *
     * @param offer for checking the shift times with the offer shift times.
     * @param guide to remove all requests that was rejected from guide.
     * @return all requests that matches offer shift times.
     */
    List<Replacement> checkIfOfferHasRequests(Replacement offer, Guide guide);

    /**
     * Returning all requests that coordinator has to approve/reject (replacement InApprovedProc = yes).
     *
     * @param coordinatorId for finding all requests coordinator has to approve/reject.
     * @return all requests coordinator has to approve/reject.
     */
    HashMap<Replacement, Guide> coordinatorReplacementRequestsToApprove(Long coordinatorId);

    /**
     * Adding guide that offers his self and request to coordinator requests approval list.
     *
     * @param request to add to list.
     * @param guide   to add to list.
     * @param offerId in case guide offered him self from the offer option
     *                (can offer his self to request or from a requests table or from a offers table with
     *                requests that the shift times matches a offer).
     * @return success operation message.
     * @throws ConflictException if the apartment in request doesn't have a coordinator
     *                           (no one to approve/reject request).
     */
    String sendRequestAndOfferToCoordinatorsApproval(Replacement request, Guide guide, Long offerId) throws ConflictException;

    /**
     * Approving guide's offer to request.
     *
     * @param guide     for setting request has guide's request (replacement InApprovedProc = approved).
     * @param requestId for getting request.
     * @param offerId   for deleting guide's offer that matches request shift times (if there any).
     * @return success operation message.
     */
    String approveReplacementRequest(Guide guide, long requestId, long offerId);

    /**
     * Rejecting guide's offer to request
     *
     * @param guide     for checking if there is a offer to reset ---> (replacement InApprovedProc = no).
     * @param requestId por adding request + guide to rejected requests list.
     * @return success operation message.
     */
    String rejectReplacementRequest(Guide guide, long requestId);

    /**
     * Checking if request is in a approval proses (replacement InApprovedProc = no/yes).
     *
     * @param requestId for finding request.
     * @param guide     for adding guide and request to rejected requests list if guide has a
     *                  request/approved offer that the shift times overlaps with the checked request.
     * @return true if replacement InApprovedProc = no/false if replacement InApprovedProc = yes.
     * @throws ConflictException if guide has a request/approved offer
     *                           that the shift times overlaps with the checked request .
     */
    Boolean checkIfReplacementIsInApprovingProcess(Long requestId, Guide guide) throws ConflictException;

    /**
     * Deleting replacement from system.
     *
     * @param requestId for getting replacement and removing replacement
     *                  from coordinator's replacement from coordinator replacements to approved list.
     * @param guideId   for checking if replacement belongs to guide.
     * @return deleted replacement id.
     * @throws ConflictException if replacement doesn't belong to guide
     *                           (was approved to other guide's offer).
     */
    Long deleteReplacement(Long requestId, Long guideId) throws ConflictException;

}

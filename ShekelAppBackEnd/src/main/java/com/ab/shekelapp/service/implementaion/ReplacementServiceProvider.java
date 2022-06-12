package com.ab.shekelapp.service.implementaion;

import com.ab.shekelapp.common.ApartmentsAndTenantsGender;
import com.ab.shekelapp.data.CoordinatorReplacementsToApproveObject;
import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.replacements.InApprovalProc;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.ab.shekelapp.repo.ReplacementRepo;
import com.ab.shekelapp.service.ex.ConflictException;
import com.ab.shekelapp.service.interfaces.ReplacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * The class is responsible for all actions performed on replacement type.
 */
@Service
public class ReplacementServiceProvider implements ReplacementService {

    /* For SQL queries on replacement type */
    private final ReplacementRepo replacementRepo;
    /* For etch coordinator to approve/reject replacements offers */
    @Lazy
    private final HashMap<Long, HashMap<Replacement, Guide>> coordinatorRequestsToApprove = new HashMap<>();

    private static final int END_CHAR_TIME = 2;

    @Autowired
    public ReplacementServiceProvider(ReplacementRepo replacementRequestRepo) {
        this.replacementRepo = replacementRequestRepo;
    }

    @Override
    public Replacement createReplacement(Guide guide, Replacement replacement) throws ConflictException {
        if (guide != null) {
            /* Checking if guide has other replacement with shift times that overlap */
            checkGuideOtherReplacementsTimesAndDates(replacement, guide, true);
            /* Attaching guide to replacement */
            replacement.setGuide(guide);
        }
        /* Checking kind of replacement (request/offer) */
        if (replacement.getApartment().getName() != null) {
            /* If request type, checking if there are other requests with the same apartment
               and shift times that overlap */
            if (replacementRepo.findAllByApartmentId(replacement.getApartment().getId()).stream()
                    .anyMatch(systemRequest -> CoordinatorReplacementsToApproveObject
                            .checkIfReplacementOverlapOtherRequests(replacement, systemRequest))) {
                /* 'there is a replacement request for apartment that overlaps this request' */
                throw new ConflictException("יש החלפה לדירה שחופפת להחלפה הנוכחית");
            }
        } else {
            /* Setting replacement has a offer type */
            replacement.setApartment(null);
        }
        /* Verifying that this is a new replacement by resetting the ID to 0 */
        replacement.setId(0L);
        /* Saving data of new replacement in the data-base */
        return replacementRepo.save(replacement);
    }

    @Override
    public List<Replacement> getAllNotGuide_sRequests(Guide guide) {
        /* Getting all replacements requests that doesn't belong to guide */
        List<Replacement> requests = replacementRepo.findAll().stream()
                .peek(this::checkAndSetReplacementGuide)
                .filter(replacement -> replacement.getApartment() != null)
                .filter(request -> request.getInApprovalProc() == InApprovalProc.no)
                .filter(request -> !request.getGuide().getId().equals(guide.getId()))
                .collect(Collectors.toList());
        /* Checking if coordinator rejected guide's offers to requests and
           removing them from the list */
        removeIfOfferIsRejected(guide, requests);
        /* Checking if there is another replacement that the shift times similar  */
        checkOverlapsInApprovalLists(requests, guide);
        /* Returning list */
        return removeRequestsWithGirlsGenderApartmentsIfGuideIsBoyGender(requests, guide.getShekelMember().getGender());
    }

    @Override
    public List<Replacement> getGuideReplacementApprovedOffers(Long guideId) {
        /* Returning all guide's approved offers */
        return replacementRepo.findAll().stream()
                .filter(replacement -> replacement.getGuide() != null)
                .filter(replacement -> replacement.getGuide().getId()
                        .equals(guideId) && replacement.getInApprovalProc()
                        .equals(InApprovalProc.approved))
                .collect(Collectors.toList());
    }

    @Override
    public List<Replacement> getAllGuideReplacementsRequestsAndOffers(Long guideId) {
        /* Getting all guide replacements from the data-base */
        List<Replacement> allByGuideId = replacementRepo.findAllByGuideId(guideId);
        /* Removing all offers that are in approval proses or that was approved */
        allByGuideId.removeIf(replacement -> replacement.getApartment() == null
                && replacement.getInApprovalProc() != InApprovalProc.no);
        /* Removing all guide's images from the replacements */
        allByGuideId.forEach(replacement -> replacement.getGuide().getShekelMember().setImage(null));
        /* Returning the list */
        return allByGuideId;
    }

    @Override
    public List<Replacement> getAllWithApartmentId(Long apartmentId) {
        /* Getting all replacements requests with the apartment id*/
        return replacementRepo.findAllByApartmentId(apartmentId);
    }

    @Override
    public List<Replacement> checkIfOfferHasRequests(Replacement offer, Guide guide) {
        /* Getting all guides requests from the data-base that the shift times overlaps offer shift times */
        List<Replacement> collectRequests = replacementRepo.findAll().stream()
                .filter(replacement -> replacement.getApartment() != null)
                .filter(replacementRequest -> replacementRequest.getGuide() != null)
                .filter(replacementRequest -> !replacementRequest.getGuide().getId().equals(offer.getGuide().getId()))
                .filter(replacementRequest -> replacementRequest.getInApprovalProc() == InApprovalProc.no)
                .filter(replacementRequest -> CoordinatorReplacementsToApproveObject.checkIfOfferOverlapRequests(replacementRequest, offer))
                .collect(Collectors.toList());
        /* Getting all coordinators and width-guides requests from the data-base
           that the shift times overlaps offer shift times */
        List<Replacement> allCoordinatorsOrWidthGuidesRequests = replacementRepo.findAll()
                .stream()
                .filter(replacementRequest -> replacementRequest.getGuide() == null)
                .filter(replacementRequest -> CoordinatorReplacementsToApproveObject.checkIfOfferOverlapRequests(replacementRequest, offer))
                .collect(Collectors.toList());
        /* Merging lists */
        collectRequests.addAll(allCoordinatorsOrWidthGuidesRequests);
         /* Checking if coordinator rejected guide's offers to requests and
          removing them from the list */
        removeIfOfferIsRejected(guide, collectRequests);
        /* Returning list */
        return removeRequestsWithGirlsGenderApartmentsIfGuideIsBoyGender(collectRequests, offer.getGuide()
                .getShekelMember()
                .getGender());
    }

    @Override
    public HashMap<Replacement, Guide> coordinatorReplacementRequestsToApprove(Long coordinatorId) {
        /* Returning all offers coordinator needs to approve/reject */
        return coordinatorRequestsToApprove.computeIfAbsent(coordinatorId, key -> new HashMap<>());
    }

    @Override
    public String sendRequestAndOfferToCoordinatorsApproval(Replacement request, Guide guide, Long offerId) throws ConflictException {
        if (findReplacementById(request.getId()).getInApprovalProc() == InApprovalProc.yes) {
            /* 'request is in a approval proses,
                if the replacement will becomes available it will reappear in the replacements table' */
            throw new ConflictException(
                    "בקשת החלפה בתהליך אישור \n אם הבקשה תתפנה היא תופיע שוב בטבלת ההחלפות");
        }

        if (request.getInApprovalProc().equals(InApprovalProc.approved)) {
            /* 'replacement has already been approved in the system' */
            throw new NoSuchElementException("החלפה כבר אושרה במערכת");
        }

        if (request.getApartment().getCoordinator() == null) {
            /* 'apartment with no coordinator ,try again after the coordinator is updated in the system' */
            throw new ConflictException("דירה ללא רכזת \n יש לנסות שוב אחרי שהרכזת תעודכן במערכת");
        }

        /* Checking if there is a offer in the system
           (guide can offer himself to a request without creating a offer replacement object) */
        Replacement offer = replacementRepo.findById(offerId).orElse(null);
        if (offer != null) {
            /* Setting and updating offer approval status */
            offer.setInApprovalProc(InApprovalProc.yes);
            replacementRepo.save(offer);
        }

        /* Setting and updating request approval status */
        request.setInApprovalProc(InApprovalProc.yes);
        /* If there is no guide to request, setting request guide as null */
        if (request.getGuide().getId() == 0) {
            request.setGuide(null);
        }
        replacementRepo.save(request);
        /* Adding request and guide to coordinator's requests to approve/reject list */
        coordinatorReplacementRequestsToApprove(request.getApartment().getCoordinator().getId())
                .put(request, guide);
        /* 'offer has been sent to coordinator,if the offer will be approved,
            it will appear in the approved offers table.' */
        return "הצעת החלפה נשלחה לרכזת , במידה וההחלפה תאושר היא תופיע בטבלת ההחלפות המאושרות";
    }

    @Override
    public String approveReplacementRequest(Guide guide, long requestId, long offerId) {
        /* Getting request from system */
        Replacement request = findReplacementById(requestId);
        /* Resetting request guide */
        request.setGuide(guide);
        /* Resetting request status */
        request.setInApprovalProc(InApprovalProc.approved);
        /* Checking if guide has a offer with shift times that overlaps request shift times */
        replacementRepo.findAllByGuideId(guide.getId()).forEach(offer -> {
            if (offer.getApartment() == null && offer.getInApprovalProc() == InApprovalProc.yes &&
                    CoordinatorReplacementsToApproveObject.checkIfOfferOverlapRequests(request, offer)) {
                /* If finding, deleting it from the data-base */
                replacementRepo.delete(offer);
            }
        });
        /* Removing the request from coordinator's requests to approve/reject */
        removeFromCoordinatorToApproveList(requestId);
        /* If the request is in one of the rejected requests list ,removing them from the list
           (only the guide that request was approved to his/hers offer)*/
        InApprovalProc.getRejectedRequests()
                .removeIf(rejectedRequest -> rejectedRequest.getReplacementRequest().getId().equals(requestId));
        /* Updating request guide and status in the system */
        replacementRepo.save(request);
        /* 'replacement offer is approved' */
        return "הצעת החלפה אושרה";
    }

    @Override
    public String rejectReplacementRequest(Guide guide, long requestId) {
        /* Getting request from system */
        Replacement request = findReplacementById(requestId);
        /* Setting request status (InApproveProc = no)  */
        setReplacementToNotInApproveProc(request);
        /* Checking if guide has a offer with shift times that overlaps request shift times */
        Optional<Replacement> guidesOfferToRequest = replacementRepo.findAllByGuideId(guide.getId())
                .stream()
                .filter(offer -> offer.getApartment() == null)
                .filter(offer -> offer.getInApprovalProc() == InApprovalProc.yes)
                .filter(offer -> CoordinatorReplacementsToApproveObject.checkIfOfferOverlapRequests(request, offer))
                .findFirst();
        /* If finding one, setting offer status (InApproveProc = no)  */
        if (guidesOfferToRequest.isPresent()) {
            setReplacementToNotInApproveProc(guidesOfferToRequest.orElseThrow());
        }
        /* Removing the request from coordinator's requests to approve/reject */
        removeFromCoordinatorToApproveList(requestId);
        /* Adding guide and request to rejected requests list */
        InApprovalProc.getRejectedRequests().add(new CoordinatorReplacementsToApproveObject(guide, request));
        /* 'replacement offer is rejected' */
        return "הצעת החלפה נדחתה";

    }

    @Override
    public Boolean checkIfReplacementIsInApprovingProcess(Long requestId, Guide guide) throws ConflictException {
        /* Getting request from system */
        Replacement request = findReplacementById(requestId);
        /* Checking if guide has other replacement with shift times that overlap */
        checkGuideOtherReplacementsTimesAndDates(request, guide, false);
        /* Returning true if request is not in a approval proses, false if
           request is in a approval proses was approved */
        return request.getInApprovalProc() == InApprovalProc.no;
    }

    @Override
    public Long deleteReplacement(Long replacementId, Long guideId) throws ConflictException {
        /* Getting request from system */
        Replacement replacement = findReplacementById(replacementId);
        /* Checking if replacement belongs to guide (If was approved before guide deleted,
           the request belongs to the guide that offered him self to the request)  */
        if (replacementRepo.findAllByGuideId(guideId)
                .stream()
                .filter(systemReplacement -> systemReplacement.getId().equals(replacement.getId()))
                .findFirst()
                .isEmpty()
                && replacement.getInApprovalProc() != InApprovalProc.no) {
            /* 'replacement doesn't belong to guide' */
            throw new ConflictException("החלפה לא שייכת למדריך");
        }
        /* Removing the request from rejected requests list (if can find any) */
        InApprovalProc.getRejectedRequests()
                .removeIf(request -> request.getReplacementRequest().getId().equals(replacementId) ||
                        /* Removing requests that was inserted to the list because guide has a similar
                           requests/approved offers in the system */
                        CoordinatorReplacementsToApproveObject.checkIfReplacementOverlapOtherRequests
                                (replacement, findReplacementById(replacementId)));
        /* Removing request from the system */
        replacementRepo.delete(replacement);
        /* Removing the request from coordinator's requests to approve/reject */
        removeFromCoordinatorToApproveList(replacementId);
        /* Returning the deleted replacement id */
        return replacement.getId();
    }


    // Help functions:

    /**
     * The function checks the start date of all replacements,
     * If the start date is equal to the current day,
     * the function is tested, the replacement is deleted from the system,
     * The function runs every hour.
     */
    @Scheduled(cron = "${cron.day.time}")

    private void deleteReplacementRequests() {
        LocalDate nowDate = LocalDate.now();
        LocalTime nowTime = LocalTime.now();

        deleteAllExpiredStartTimeReplacementsFromDB(nowDate, nowTime);

        removeAllExpiredStartTimeRequestsFromAllCoordinatorsToApproveLists(nowDate, nowTime);

        removeAllExpiredStartTimeRequestsFromRejectedRequestsList(nowDate, nowTime);
    }

    /**
     * A function for deleting all replacement with expired start time from the data base.
     *
     * @param nowDate current day.
     * @param nowTime current time.
     */
    private void deleteAllExpiredStartTimeReplacementsFromDB(LocalDate nowDate, LocalTime nowTime) {
        replacementRepo.findAll().forEach(replacement -> {
            long replacementDeleteHour;
            boolean isReplacementDateAndTimeExpired;
            /* Checking replacement status */
            if (replacement.getInApprovalProc() == InApprovalProc.approved) {
                /* If approved, checking if replacement end time is over */
                replacementDeleteHour = parseLong(replacement.getEnd().getTime().substring(0, END_CHAR_TIME));
                isReplacementDateAndTimeExpired = replacement.getEnd()
                        .getDay()
                        .isBefore(nowDate) || replacement.getEnd()
                        .getDay()
                        .equals(nowDate) && replacementDeleteHour <= nowTime.getHour();
            } else {
                /* If not, checking if replacement start time is over */
                replacementDeleteHour = parseLong(replacement.getStart().getTime().substring(0, END_CHAR_TIME));
                isReplacementDateAndTimeExpired = replacement.getStart().getDay().isBefore(nowDate)
                        || replacement.getStart()
                        .getDay()
                        .equals(nowDate) && replacementDeleteHour <= nowTime.getHour();
            }
            /* Checking if to delete replacement from thr data-base */
            if (isReplacementDateAndTimeExpired) {
                /* Deleting replacement from the data-base */
                replacementRepo.delete(replacement);
            }
        });
    }

    /**
     * A function for removing a request from coordinator's approval list.
     *
     * @param requestId the removed request id.
     */
    private void removeFromCoordinatorToApproveList(Long requestId) {
        for (Map.Entry<Long, HashMap<Replacement, Guide>>
                requestToApprove : coordinatorRequestsToApprove.entrySet()) {
            requestToApprove.getValue()
                    .keySet()
                    .removeIf(request -> request.getId().equals(requestId));
        }
    }

    /**
     * A function for removing a request from list if guide has a similar shift times offer in one
     * of the coordinator's approval lists.
     *
     * @param nowDate current day.
     * @param nowTime current time.
     */
    private void removeAllExpiredStartTimeRequestsFromAllCoordinatorsToApproveLists(LocalDate nowDate, LocalTime nowTime) {

        coordinatorRequestsToApprove.forEach((coordinatorId, replacementRequestGuideHashMap) -> {
            try {
                replacementRequestGuideHashMap.forEach((request, guide) -> {

                    if (request.getStart()
                            .getDay()
                            .equals(nowDate) && parseLong(request.getStart()
                            .getTime()
                            .substring(0, END_CHAR_TIME)) <= nowTime.getHour() || request
                            .getStart()
                            .getDay()
                            .isBefore(nowDate)) {
                        coordinatorReplacementRequestsToApprove(request.getApartment()
                                .getCoordinator()
                                .getId()).remove(request, guide);
                    }
                });
            } catch (ConcurrentModificationException ignore) {
            }
        });
    }

    /**
     * A function for removing all expired requests from the rejected requests list.
     *
     * @param nowDate current day.
     * @param nowTime current time.
     */
    private void removeAllExpiredStartTimeRequestsFromRejectedRequestsList(LocalDate nowDate, LocalTime nowTime) {
        InApprovalProc.getRejectedRequests()
                .removeIf(request -> request.getReplacementRequest()
                        .getStart()
                        .getDay()
                        .isEqual(nowDate) && parseLong(request.getReplacementRequest()
                        .getStart()
                        .getTime()
                        .substring(0, END_CHAR_TIME)) <= nowTime.getHour()
                        || request.getReplacementRequest().getStart().getDay().isBefore(nowDate));
    }

    /**
     * Because a male guide can't replace in a girls apartment, this function
     * removed all ApartmentsAndTenantsGender.GIRLS apartments if guide is a male.
     *
     * @param requests the list to remove requests from.
     * @param gender   for checking guide's gender.
     * @return The updated list.
     */
    private List<Replacement> removeRequestsWithGirlsGenderApartmentsIfGuideIsBoyGender
    (List<Replacement> requests, ApartmentsAndTenantsGender gender) {
        if (gender == ApartmentsAndTenantsGender.BOYS) {
            return requests.stream()
                    .filter(request -> request.getApartment().getGender() == ApartmentsAndTenantsGender.BOYS)
                    .collect(Collectors.toList());
        }
        return requests;
    }

    /**
     * A function for checking if there is a rejected request with the same guide in a list
     * and removing it/them if finding any.
     *
     * @param guide       to check if the rejected request is a pair with the guide (<key,value>).
     * @param checkedList the list to check.
     */
    private void removeIfOfferIsRejected(Guide guide, List<Replacement> checkedList) {
        for (CoordinatorReplacementsToApproveObject rejectedRequest : InApprovalProc.getRejectedRequests()) {
            checkedList.removeIf(request -> request.getId()
                    .equals(rejectedRequest.getReplacementRequest()
                            .getId()) && guide.getId()
                    .equals(rejectedRequest.getGuide().getId()));
        }
    }

    /**
     * Before returning all not guide's requests list this function is checking
     * if there is guide has offer(s) in the coordinators requests to approve lists
     * that the replacements shift times overlaps , if there are the function is removing the
     * request(s) from the all not guide's requests list.
     *
     * @param requests the list to check.
     * @param guide    to compere with guides in the coordinator's approval lists.
     */
    private void checkOverlapsInApprovalLists(List<Replacement> requests, Guide guide) {
        for (int i = 0; i < requests.size(); i++) {
            int index = i;
            coordinatorRequestsToApprove.forEach((coordinatorId, replacementRequestGuideHashMap) -> {
                replacementRequestGuideHashMap.forEach((request, listGuide) -> {
                    if (CoordinatorReplacementsToApproveObject.checkIfReplacementOverlapOtherRequests(requests.get(index), request) && guide
                            .equals(listGuide)) {
                        requests.remove(index);
                    }
                });
            });
        }
    }

    /**
     * A function for setting a fake guide to all the replacements with no guide.
     * (called when returning all not guide's requests list).
     *
     * @param replacement to add guide to.
     */
    private void checkAndSetReplacementGuide(Replacement replacement) {
        if (replacement.getGuide() == null) {
            Guide guide = new Guide();
            guide.setId(0L);
            replacement.setGuide(guide);
        }
    }

    /**
     * This function is called when guide is inserting a new replacement to the system or
     * when guide offers him self to a request for checking if guide has a replacement
     * that the shift times overlaps.
     *
     * @param replacement to check.
     * @param guide       for getting all guide's replacements.
     * @param newRequest  for checking if to add request to the rejected requests list.
     * @throws ConflictException if finding a replacement that the shift times overlaps with the checked replacement.
     */
    private void checkGuideOtherReplacementsTimesAndDates(Replacement replacement, Guide guide, boolean newRequest) throws ConflictException {

        for (Replacement guideRequest : replacementRepo.findAllByGuideId(guide.getId())) {
            if (CoordinatorReplacementsToApproveObject.checkIfReplacementOverlapOtherRequests(guideRequest, replacement)) {
                if (!newRequest) {
                    InApprovalProc.getRejectedRequests().add(
                            new CoordinatorReplacementsToApproveObject(guide, replacement));
                }
                /* '...(guide's name) already has a replacement with similar shift times in the system' */
                throw new ConflictException(" יש החלפה עם שעות חופפות במערכת " + guide.getShekelMember()
                        .getFirstName() + " " + guide.getShekelMember().getLastName() + "ל ");
            }
        }
    }

    /**
     * A function for resetting a replacement approval status.
     *
     * @param replacement the rested replacement.
     */
    private void setReplacementToNotInApproveProc(Replacement replacement) {
        replacement.setInApprovalProc(InApprovalProc.no);
        replacementRepo.save(replacement);
    }

    /**
     * A function for getting replacement details from the data-base by id
     * (a function only for the class for avoiding code duplication).
     *
     * @param replacementId of the requested replacement.
     * @return the requested replacement.
     */
    private Replacement findReplacementById(Long replacementId) {
        return replacementRepo.findById(replacementId)
                /* 'request is not in the system' */
                .orElseThrow(() -> new NoSuchElementException("ההחלפה אינה רשומה במערכת"));
    }

    private Long parseLong(String stringToParse) {
        return Long.parseLong(stringToParse);
    }

}

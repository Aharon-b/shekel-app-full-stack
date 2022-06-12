package com.ab.shekelapp.data;

import com.ab.shekelapp.entity.Guide;
import com.ab.shekelapp.entity.replacements.Replacement;
import com.ab.shekelapp.entity.replacements.ShiftTime;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * This class is for coordinators to approve or reject guide offer of request.
 */
public class CoordinatorReplacementsToApproveObject {
    // The guide how offered him self.
    private final Guide guide;
    // The request.
    private final Replacement replacementRequest;

    private static final long ONE_HOUR_IN_MILLI_SECONDS = 3_600_000;
    private static final int MULTIPLE_TO_MILLI_SECONDS = 1000;
    private static final int LAST_CHAR_END_HOUR = 5;
    private static final int FIRST_CHAR_END_HOUR = 3;
    private static final int LAST_CHAR_START_HOUR = 2;

    public CoordinatorReplacementsToApproveObject(Guide guide, Replacement replacementRequest) {
        this.guide = guide;
        this.replacementRequest = replacementRequest;
    }

    public Guide getGuide() {
        return guide;
    }

    public Replacement getReplacementRequest() {
        return replacementRequest;
    }

    /**
     * A function for checking if offer and request shift times overlaps.
     *
     * @param request for checking request shift times.
     * @param offer   for checking shift offer.
     * @return boolean is the shift times overlaps.
     */
    public static boolean checkIfOfferOverlapRequests(Replacement request, Replacement offer) {

        long requestStartMilliSeconds = setShiftTimeToMilliSeconds(request.getStart());
        long requestEndMilliSeconds = setShiftTimeToMilliSeconds(request.getEnd());
        long offerStartMilliSeconds = setShiftTimeToMilliSeconds(offer.getStart());
        long offerEndMilliSeconds = setShiftTimeToMilliSeconds(offer.getEnd());

        return requestStartMilliSeconds == offerStartMilliSeconds || requestEndMilliSeconds == offerEndMilliSeconds
                || requestStartMilliSeconds <= (offerStartMilliSeconds - ONE_HOUR_IN_MILLI_SECONDS)
                && requestEndMilliSeconds >= (offerEndMilliSeconds + ONE_HOUR_IN_MILLI_SECONDS)
                || requestStartMilliSeconds > offerStartMilliSeconds && requestStartMilliSeconds < offerEndMilliSeconds
                || requestEndMilliSeconds < offerEndMilliSeconds && requestEndMilliSeconds > offerStartMilliSeconds;
    }

    /**
     * A function that is called before inserting a new replacement for checking if guide has other
     * replacement that the shift times overlaps with the new replacement, or if the replacement is
     * a request type checking if there are request that are with the same apartment and the
     * shift times overlaps (in case there are, throwing conflict exception).
     *
     * @param request       the new request.
     * @param systemRequest the request from the date-base to compere shift times to .
     * @return boolean is the shift times overlaps.
     */
    public static boolean checkIfReplacementOverlapOtherRequests(Replacement request, Replacement systemRequest) {

        long requestStartMilliSeconds = setShiftTimeToMilliSeconds(request.getStart());
        long requestEndMilliSeconds = setShiftTimeToMilliSeconds(request.getEnd());
        long systemRequestStartMilliSeconds = setShiftTimeToMilliSeconds(systemRequest.getStart());
        long systemRequestEndMilliSeconds = setShiftTimeToMilliSeconds(systemRequest.getEnd());

        return (systemRequestStartMilliSeconds - ONE_HOUR_IN_MILLI_SECONDS) <= requestEndMilliSeconds && (systemRequestEndMilliSeconds + ONE_HOUR_IN_MILLI_SECONDS) >= requestStartMilliSeconds;
    }

    // Help function:

    private static long setShiftTimeToMilliSeconds(ShiftTime shiftTime) {
        LocalDate day = shiftTime.getDay();
        String time = shiftTime.getTime();

        ZoneId zoneId = ZoneId.systemDefault();
        return LocalDateTime.of(day.getYear(), day.getMonth(), day.getDayOfMonth(),
                Integer.parseInt(time.substring(0, LAST_CHAR_START_HOUR)), Integer
                        .parseInt(time.substring(FIRST_CHAR_END_HOUR, LAST_CHAR_END_HOUR)))
                .atZone(zoneId)
                .toEpochSecond() * MULTIPLE_TO_MILLI_SECONDS;
    }

}

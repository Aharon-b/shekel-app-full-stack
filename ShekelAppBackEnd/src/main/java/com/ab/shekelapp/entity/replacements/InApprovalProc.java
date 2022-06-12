package com.ab.shekelapp.entity.replacements;

import com.ab.shekelapp.data.CoordinatorReplacementsToApproveObject;

import java.util.ArrayList;
import java.util.List;

public enum InApprovalProc {
    no, yes, approved;

    // For coordinators to add replacement requests the guides was rejected to.
    private static final List<CoordinatorReplacementsToApproveObject> REJECTED_REQUESTS = new ArrayList<>();

    public static List<CoordinatorReplacementsToApproveObject> getRejectedRequests() {
        return REJECTED_REQUESTS;
    }
}

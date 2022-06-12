import { Apartment } from '../apartment/apartment.modules';
import { Guide } from '../guide/guide.modules';
import { InApprovalProc } from './inApprovalProc';
import { ShiftTime } from './shift_time.modules';

export class Replacement {

    id: number
    guide: Guide
    start: ShiftTime
    end: ShiftTime
    comments: string
    inApprovalProc: InApprovalProc
    apartment: Apartment
    requestOffers: Replacement[]

    constructor(
        id: number,
        guide: Guide,
        start: ShiftTime,
        end: ShiftTime,
        comments: string,
        inApprovalProc: InApprovalProc,
        apartment: Apartment,
        requestOffers: Replacement[]
    ) {
        this.id = id
        this.guide = guide
        this.start = start
        this.end = end
        this.comments = comments
        this.inApprovalProc = inApprovalProc
        this.apartment = apartment
        this.requestOffers = requestOffers
    }

} 
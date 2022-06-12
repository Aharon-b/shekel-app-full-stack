import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apartment } from '../apartment/apartment.modules';
import { Chore } from '../chores/chores.modules';
import { AbsServiceClass } from '../common/AbcServiceClass';
import { ShekelMember } from '../common/main-objects/shekelMember.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { LoginStorageService } from '../login/login-storage-service';
import { Medicine } from '../medicine/medicine-list/medicine.modules';
import { Replacement } from '../replacements/replacement.modules';
import { Tenant } from '../tenant/tenant.modules';
import { Guide } from './guide.modules';
import { GuideStorageService } from './guide.storage.service';

@Injectable()
export class GuideService implements AbsServiceClass {
    // For user type 'Guide' in string.
    private guideString: string = PrivateStringsForApp.getGuideEnglishString()
    // (Can navigate to 'apartment-display' from 'user-start' component & also from 'replacements-page')
    // this field is for knowing to which component to navigate when user is pressing 
    // on the 'return' button in the 'apartment-display' component.
    private toNavigateToReplacementPage: boolean = false
    // For saving guide's id (after updating details).
    private guideId: number = 0

    // For displaying guide's general details.
    shekelMember: ShekelMember = {} as ShekelMember
    // For displaying apartment details.
    apartment: Apartment = {} as Apartment
    // For displaying tenant details.
    tenant: Tenant = {} as Tenant
    // For displaying chore details.
    chore: Chore = {} as Chore
    // For displaying medicine details.
    medicine: Medicine = {} as Medicine

    // For getting user type Guide details.
    userEmitter = new EventEmitter<Guide>()
    // For getting all replacements in the system that doesn't belong to guide array.
    allNotGuidesReplacementsRequests: Replacement[] = []
    // For getting user type Guide's apartments array.
    apartmentsEmitter = new EventEmitter<Apartment[]>()
    // For getting apartment tenants array.
    tenantsEmitter = new EventEmitter<Tenant[]>()

    // For checking if user needs to update is default password.
    passwordUpdateEmitter = new EventEmitter<boolean>()
    // For showing/heading 'user-start' component.
    showStartPageElementsEmitter = new EventEmitter<boolean>()
    // For showing/heading 'add-replacement-request-or-offer' component.
    showReplacementRequestEmitter = new EventEmitter<boolean>()
    // For setting the kind of replacement in the 'add-replacement-request-or-offer' component.
    requestOrOfferEmitter = new EventEmitter<boolean>()
    // For 'edit-....' components image fields.
    blobEmitter = new EventEmitter<Blob>()
    // For error/success details display purposes.
    msgEmitter = new EventEmitter<string>()

    constructor(
        private loginStorageService: LoginStorageService,
        private guideStorageService: GuideStorageService,
        private sanitizer: DomSanitizer,
        private router: Router) { }

    // User functions:

    // This function is called when user type Guide is logging to the system, for user details.
    getUserDetails() {
        // Subscribing to http request for getting guide details.
        this.guideStorageService.getGuideDetails(this.loginStorageService.getToken()).subscribe(guide => {
            // Setting the relevant fields from given Guide object.
            this.guideId = guide.id
            this.shekelMember = guide.shekelMember
            // Emitting the Guide object.
            this.userEmitter.emit(guide)
        })
    }

    // This function is called when user type Guide updates his details
    // (for setting username field before navigating to 'edit-user' component).
    getLoggedInUsername(): string {
        return this.loginStorageService.getUsername()
    }

    // This function is called when user type Guide is logging to the system, 
    // for checking which component to display ('change-password-display'/'user-start') .
    isPasswordUpdated(): boolean {
        return this.loginStorageService.isPasswordUpdated()
    }

    // This function is called when user type Guide is updating is details.
    getUserImage(): Promise<number[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting guide image byte array.
            this.guideStorageService.getGuideImage(this.guideId).subscribe(imageByteArray => {
                // Passing user's image byte array.
                res(imageByteArray)
            })
        })
    }

    // This function is called when user type Guide is submitting the 'user-edit' component.
    updateUserDetails(shekelMember: ShekelMember, username: string, filename: File) {
        // Initialize empty type Guide object.
        const guide = {} as Guide
        // Setting updated guide details.
        guide.id = this.guideId
        guide.username = username
        guide.shekelMember = shekelMember
        // Subscribing to http request for getting updated guide details from the system.
        this.guideStorageService.updateGuideDetails(guide, filename).subscribe(guide => {
            // For displaying guide's general details.
            this.shekelMember = guide.shekelMember
            // Subscribing to http request for getting updated guide new token 
            // (because if user's username is updated need to get a new token).
            this.loginStorageService.getUserToken(guide.username, this.loginStorageService.getPassword())
                .subscribe(token => {
                    // Extracting the new token.
                    const newToken = token.headers.get(PrivateStringsForApp.getAuthorizationString())
                    if (newToken) {
                        // Setting the new token as user's token.
                        this.loginStorageService.setToken(newToken)
                        // Navigating to user's start page.
                        this.navigateByUrl(this.guideString)
                    }
                })
        })
    }

    // This function is called when user type Guide is submitting the 'change-password-display' component.
    changeUserPassword(password: string) {
        // Subscribing to http request for getting operation success message.
        this.guideStorageService.changeGuidePassword(password).subscribe(msg => {
            // Getting the new token (with the new password).
            this.loginStorageService.getUserToken(this.loginStorageService.getUsername(), password)
            // Emitting success message.
            this.msgEmitter.emit(msg)
        })
    }

    // This function is called when user type Guide is logging to the system, 
    // for user's apartments array.
    getUserApartments(): void {
        // Subscribing to http request for getting user's apartments array from the system.
        this.guideStorageService.getGuideApartments().subscribe(guidesApartmentsArray => {
            // Emitting the given array.
            this.apartmentsEmitter.emit(guidesApartmentsArray)
        })
    }

    // This function is called when user type Guide is logging to the system, 
    // for user's tenants array.
    getUserTenants(): Promise<Tenant[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting user's tenants array from the system.
            this.guideStorageService.getGuideTenants().subscribe(coordinatorTenants => {
                // Passing the given array to the function that called this function.
                res(coordinatorTenants)
            })
        });
    }

    // This function is called when guide is submitting the form in 'add-replacement-request-or-offer' component.
    addReplacementToUserArray(replacement: Replacement): Promise<Replacement> {
        return new Promise((res, rej) => {
            // Subscribing to http request for adding + getting the new replacement from the system.
            this.guideStorageService.addReplacementToGuideArray(replacement).subscribe(replacement => {
                // Passing the given replacement.
                res(replacement)
            }, /** In case of error */ error => { /** Passing the given error */ rej(error) })
        })
    }

    // Apartment functions:

    // This function is called when user type Guide is pressing on when of the apartments image.
    apartmentDisplay(apartment: Apartment): void {
        // Setting the apartment field.
        this.apartment = apartment
        // Navigating to 'user-apartment-display'. 
        this.navigateByUrl(PrivateStringsForApp.apartmentDisplayUrl(this.guideString))
    }

    // This function is called when navigating to 'user-apartment-display' 
    // for getting apartment tenants array.
    getApartmentTenants(apartmentId: number): void {
        // Subscribing to http request for getting apartment tenants array from the system.
        this.guideStorageService.getApartmentTenants(apartmentId).subscribe(tenant => {
            // Emitting the given tenants array.
            this.tenantsEmitter.emit(tenant)
        })
    }

    // This function is called when navigating to 'user-start' 
    // for the 'user-apartments-display' component for getting each apartment image.
    getApartmentImage(apartmentId: number): Promise<number[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting apartment image byte array from the system.
            this.guideStorageService.getApartmentImage(apartmentId).subscribe(imageByteArray => {
                // Passing the given image byte array.
                res(imageByteArray)
            })
        });
    }

    // Tenant functions:

    // This function is called when user type Guide is pressing 
    // on one of the tenants in the 'apartments-list' component.
    getTenantPersonalDetails(tenant: Tenant): void {
        // Setting the tenant field.
        this.tenant = tenant
        // Navigating to 'tenant-details' component.
        this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.guideString))
    }

    // This function is called when navigating to 'tenant-details' component
    //  for displaying tenant's medicine array.
    getTenantMedicineArray(tenantId: number): Promise<Medicine[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting tenant's medicine array from the system.
            this.guideStorageService.getTenantMedicineArray(tenantId).subscribe(medicineArray => {
                // Passing the given array.
                res(medicineArray)
            })
        })
    }

    // This function is called when navigating to 'tenant-details' component
    //  for displaying tenant medicines image.
    getMedicineImage(medicineId: number): Promise<number[]> {
        return new Promise((res, rej) => {
            // Subscribing to http request for getting medicine's image byte array from the system.
            this.guideStorageService.getMedicineImage(medicineId).subscribe(medicineImageArray => {
                // Passing the given array.
                res(medicineImageArray)
            }, /** In case of error */ error => { /** passing the error message */ rej(error)
            })
        });
    }

    // This function is called when navigating to 'tenant-details' component
    //  for displaying tenant's chores array.
    getTenantChoresArray(tenantId: number): Promise<Chore[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting tenant's chores array from the system.
            this.guideStorageService.getTenantChoresArray(tenantId).subscribe(choresList => {
                // Passing the given array.
                res(choresList)
            })
        })
    }

    // This function is called when navigating to 'tenant-details' component
    //  for displaying tenant's image.
    getTenantImage(tenantId: number): Promise<number[]> {
        return new Promise((res, rej) => {
            // Subscribing to http request for getting tenant's image byte array from the system.
            this.guideStorageService.getTenantImage(tenantId).subscribe(tenantImageArray => {
                // Passing the given array.
                res(tenantImageArray)
            }, /** In case of error */ error => { /** passing the error message */ rej(error)
            })
        });
    }

    // Guide image function:

    // This function is called when guide is pressing on the 'update-details' button for displaying guide image.
    getGuideImage(guideId: number): Promise<number[]> {
        return new Promise((res, rej) => {
            // Subscribing to http request for getting guide's image byte array from the system.
            this.guideStorageService.getGuideImage(guideId).subscribe(guideImageArray => {
                // Passing the given array.
                res(guideImageArray)
            }, /** In case of error */ error => { /** passing the error message */ rej(error)
            })
        })
    }

    // Replacement Request/offer functions:

    // This function is called when guide is navigating 
    // to 'apartment-display' component from 'replacements-table' component.
    doNavigateToReplacementPage(): void {
        this.toNavigateToReplacementPage = true
    }

    // This function is called when guide is navigating 
    // to 'apartment-display' component from 'user-start' component.
    donutNavigateToReplacementPage(): void {
        this.toNavigateToReplacementPage = false
    }

    // This function is called when guide is pressing on the 'return' button 
    // in the 'apartment-display' component.
    getNavigateToReplacementPage(): boolean {
        return this.toNavigateToReplacementPage
    }

    // This function is called when guide navigates to 'replacements-table' component 
    // for the 'all replacement requests that doesn't belong to guide' table.
    getAllNotGuide_sRequests(): Promise<Replacement[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting all replacement 
            // requests that doesn't belong to guide from the system.
            this.guideStorageService.getAllNotGuide_sRequests().subscribe(replacementRequestArray => {
                // Passing the given array.
                res(replacementRequestArray)
            })
        })
    }

    // This function is called when guide navigates to 'replacements-table' component 
    // for the 'all guide replacement offers that coordinators approved' table.
    getGuideReplacementApprovedOffers(): Promise<Replacement[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting all guide 
            // replacement offers that coordinators approved from the system.
            this.guideStorageService.getGuideReplacementApprovedOffers().subscribe(replacementOfferArray => {
                // Passing the given array.
                res(replacementOfferArray)
            })
        })
    }

    // This function is called when guide navigates to 'replacement-table' 
    // component for the 'all guide replacement requests' table.
    getAllGuideReplacementsRequestsAndOffers(): Promise<Replacement[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting all guide replacement requests from the system.
            this.guideStorageService.getAllGuideReplacementsRequestsAndOffers().subscribe(replacementsArray => {
                // Passing the given array.
                res(replacementsArray)
            })
        })
    }

    // This function is called when guide navigates to 'replacements-table' component 
    // for the 'requests that fits offer' table inside the 'guide replacements offers' table.
    checkIfOfferHasRequests(request: Replacement): Promise<Replacement[]> {
        return new Promise((res) => {
            // Subscribing to http request for getting all replacements 
            // request that fits each guide's replacement offers.
            this.guideStorageService.checkIfOfferHasRequests(request).subscribe(offersToRequest => {
                // Passing the given array.
                res(offersToRequest)
            })
        })
    }

    // This function is called when guide is deleting a replacement request.
    deleteReplacement(replacementRequest: Replacement): Promise<number> {
        return new Promise((res) => {
            // Subscribing to http request for deleting replacement request from the system.
            this.guideStorageService.deleteReplacement(replacementRequest).subscribe(replacementRequestId => {
                // Passing the given replacement request id.
                res(replacementRequestId)
            })
        })
    }

    // This function is called when guide offers him self to a replacement request 
    // for checking replacement status.
    checkIfReplacementIsInApprovingProcess(replacementRequestId: number) {
        return new Promise((res, rej) => {
            // Subscribing to http request for getting replacement request status.
            this.guideStorageService.checkIfReplacementIsInApprovingProcess(replacementRequestId).subscribe(isInProcess => {
                // Passing the given boolean.
                res(isInProcess)
            }, /** In case of error */ error => { /** passing the error message */ rej(error)
            })
        })
    }

    // This function is called when guide offers him self to a replacement request 
    // after checking replacement status for sending request & offer to coordinators 
    // replacements requests approval array.
    sendRequestAndOfferToCoordinatorsApproval(replacementRequest: Replacement, offerId: number): Promise<string> {
        return new Promise((res, rej) => {
            // Subscribing to http request for sending request & offer to coordinator's approval.
            this.guideStorageService.sendRequestAndOfferToCoordinatorsApproval(replacementRequest, offerId).subscribe(successMessage => {
                // Passing the success operation message.
                res(successMessage)
            }, /** In case of error */ error => { /** passing the error message */ rej(error)
            })
        })
    }

    // Help functions:

    // This function is for flashing error messages.
    flashErrorMessage(msg: string, times: number) {
        AbsServiceClass.prototype.flashErrorMessage.call(this, msg, times)
    }

    // This function is for setting image byte array as a SafeUrl object.
    setBlobImage(imageByte: number[]): SafeUrl {
        return AbsServiceClass.prototype.setBlobImage.call(this, imageByte, this.sanitizer)
    }

    // This function is for passing the router field when navigating to a different component.
    getRouter() {
        return this.router
    }

    // This function is for passing the sanitizer field for images display purposes.
    getServiceSanitizer(): DomSanitizer {
        return this.sanitizer
    }

    // This function is for navigating between components.
    navigateByUrl(url: string): void {
        this.router.navigateByUrl(url)
    }

}
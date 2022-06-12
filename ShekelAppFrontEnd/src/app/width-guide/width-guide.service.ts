import { EventEmitter, Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Apartment } from '../apartment/apartment.modules';
import { Chore } from '../chores/chores.modules';
import { AbsServiceClass } from '../common/AbcServiceClass';
import { ShekelMember } from '../common/main-objects/shekelMember.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { Guide } from '../guide/guide.modules';
import { LoginStorageService } from '../login/login-storage-service';
import { Medicine } from '../medicine/medicine-list/medicine.modules';
import { Replacement } from '../replacements/replacement.modules';
import { Tenant } from '../tenant/tenant.modules';
import { WidthGuide } from './width-guide-modules';
import { WidthGuideStorageService } from './width-guide.storage.service';

@Injectable()
export class WidthGuideService implements AbsServiceClass {
  // For user type 'WidthGuide' in string.
  private widthGuideString: string = PrivateStringsForApp.getWidthGuideEnglishString()
  // For saving widthGuide's id (after updating details).
  private widthGuideId: number = 0

  // For displaying widthGuide's general details.
  shekelMember: ShekelMember = {} as ShekelMember
  // For displaying apartment details.
  apartment: Apartment = {} as Apartment
  // For displaying tenant details.
  tenant: Tenant = {} as Tenant
  // For displaying medicine details.
  medicine: Medicine = {} as Medicine
  // For displaying chore details.
  chore: Chore = {} as Chore

  // For getting user type WidthGuide details.
  userEmitter = new EventEmitter<WidthGuide>()
  // For getting chore details.
  choreEmitter = new EventEmitter<Chore>()
  // For getting user type WidthGuide's apartments array.
  apartmentsEmitter = new EventEmitter<Apartment[]>()
  // For getting apartment guides array.
  guidesEmitter = new EventEmitter<Guide[]>()
  // For getting apartment tenants array.
  tenantsEmitter = new EventEmitter<Tenant[]>()

  // For checking if user needs to update is default password.
  passwordUpdateEmitter = new EventEmitter<boolean>()
  // For showing/heading 'user-start' component.
  showStartPageElementsEmitter = new EventEmitter<boolean>()
  // For showing/heading 'add-replacement-request' component.
  showReplacementRequestEmitter = new EventEmitter<boolean>()
  // For setting the kind of request in the 'add-replacement-request' component.
  requestOrOfferEmitter = new EventEmitter<boolean>()
  // For setting default medicine image array (when creating a new medicine object).
  blobEmitter = new EventEmitter<Blob>()
  // For error/success details display purposes.
  msgEmitter = new EventEmitter<string>()

  constructor(
    private loginStorageService: LoginStorageService,
    private widthGuideStorageService: WidthGuideStorageService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  // User functions:

  // This function is called when user type WidthGuide is logging to the system, for user details.
  getUserDetails() {
    // Subscribing to http request for getting widthGuide details.
    this.widthGuideStorageService.getWidthGuideDetails(this.loginStorageService.getToken()).subscribe(widthGuide => {
      // Setting the relevant fields from given WidthGuide object.
      this.widthGuideId = widthGuide.id
      this.shekelMember = widthGuide.shekelMember
      // Emitting the WidthGuide object.
      this.userEmitter.emit(widthGuide)
    })
  }

  // This function is called when user type WidthGuide updates his details
  // (for setting username field before navigating to 'edit-user' component).
  getLoggedInUsername(): string {
    return this.loginStorageService.getUsername()
  }

  // This function is called when user type WidthGuide is logging to the system, 
  // for checking which component to display ('change-password-display'/'user-start') .
  isPasswordUpdated(): boolean {
    return this.loginStorageService.isPasswordUpdated()
  }

  // This function is called when user type WidthGuide is submitting the 'user-edit' component.
  updateUserDetails(shekelMember: ShekelMember, username: string, _filename: File) {
    // Initialize empty type WidthGuide object.
    const widthGuide = {} as WidthGuide
    // Setting updated widthGuide details.
    widthGuide.id = this.widthGuideId
    widthGuide.username = username
    widthGuide.shekelMember = shekelMember
    // Subscribing to http request for getting updated widthGuide details from the system.
    this.widthGuideStorageService.updateWidthGuideDetails(widthGuide)
      .subscribe(widthGuide => {
        // For displaying widthGuide's general details.
        this.shekelMember = widthGuide.shekelMember
        // Subscribing to http request for getting updated widthGuide new token 
        // (because if user's username is updated need to get a new token).
        this.loginStorageService.getUserToken(widthGuide.username, this.loginStorageService.getPassword())
          .subscribe(token => {
            // Extracting the new token. 
            var newToken = token.headers.get(PrivateStringsForApp.getAuthorizationString())
            // Checking if the new token field is defined.
            if (newToken) {
              // Setting the new token as user's token.
              this.loginStorageService.setToken(newToken)
              // Navigating to user's start page.
              this.navigateByUrl(this.widthGuideString)
            }
          })
      })
  }

  // This function is called when user type WidthGuide is submitting the 'change-password-display' component.
  changeUserPassword(password: string) {

    this.widthGuideStorageService.changeWidthGuidePassword(password).subscribe(msg => {
      // Getting the new token (with the new password).
      this.loginStorageService.getUserToken(this.loginStorageService.getUsername(), password)
      // Emitting success message.
      this.msgEmitter.emit(msg)
    })
  }

  // This function is called when user type WidthGuide is logging to the system, 
  // for user's apartments array.
  getUserApartments() {
    // Subscribing to http request for getting user's apartments array from the system.
    this.widthGuideStorageService.getWidthGuideApartments().subscribe(apartmentList => {
      // Emitting the given array.
      this.apartmentsEmitter.emit(apartmentList)
    })
  }

  // This function is called when user type WidthGuide is logging to the system, 
  // for user's tenants array.
  getUserTenants(): Promise<Tenant[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting user's tenants array from the system.
      this.widthGuideStorageService.getWidthGuideTenants().subscribe(widthGuideTenants => {
        // Passing the given array to the function that called this function.
        res(widthGuideTenants)
      })
    })
  }

  // This function is called when user type WidthGuide is adding a new replacement to the system.
  addReplacementToUserArray(replacementRequest: Replacement): Promise<Replacement> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting the new replacement object from the system.
      this.widthGuideStorageService.addApartmentReplacementFromWidthGuide_sCoordinatorApartmentsToSystem(replacementRequest)
        .subscribe(replacementRequest => {
          // Passing the given request.
          res(replacementRequest)
        }/** In case of error */, error => { rej(error) })
    })
  }

  // Apartment functions:

  // This function is called when user type WidthGuide is pressing on when of the apartments image.
  apartmentDisplay(apartment: Apartment) {
    // For displaying the clicked apartment in the 'apartment-details' component.
    this.apartment = apartment
    // Navigating to 'user-apartment-display'. 
    this.navigateByUrl(PrivateStringsForApp.apartmentDisplayUrl(this.widthGuideString))
  }

  // This function is called when navigating to 'user-apartment-display' 
  // for getting apartment tenants array.
  getApartmentTenants(apartmentId: number) {
    // Subscribing to http request for getting apartment tenants array from the system.
    this.widthGuideStorageService.getApartmentTenants(apartmentId).subscribe(tenantsArray => {
      // Emitting the given tenants array.
      this.tenantsEmitter.emit(tenantsArray)
    })
  }

  // This function is called when navigating to 'user-start' 
  // for the 'user-apartments-display' component for getting each apartment image.
  getApartmentImage(apartmentId: number): Promise<number[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting apartment image byte array from the system.
      this.widthGuideStorageService.getApartmentImage(apartmentId).subscribe(imageByteArray => {
        // Passing the given image byte array.
        res(imageByteArray)
      })
    })
  }

  // This function is called when widthGuide is pressing on the 'guides' button 
  // in the 'user-apartment-display' for getting apartment guides array.
  getApartmentGuides(): void {
    // Subscribing to http request for getting apartment guides array from the system.
    this.widthGuideStorageService.getApartmentGuides(this.apartment.id).subscribe(guidesList => {
      // Emitting the given array.
      this.guidesEmitter.emit(guidesList)
    })
  }

  // Tenant functions:

  // This function is called when user type WidthGuide is pressing 
  // on one of the tenants in the 'apartments-list' component.
  getTenantPersonalDetails(tenant: Tenant) {
    // For displaying tenant's details in the 'tenant-details' component.
    this.tenant = tenant
    // Navigating to 'tenant-details' component.
    this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.widthGuideString))
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's medicine array.
  getTenantMedicineArray(tenantId: number): Promise<Medicine[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting tenant's medicine array from the system.
      this.widthGuideStorageService.getTenantMedicineArray(tenantId).subscribe(medicineArray => {
        // Passing the given array.
        res(medicineArray)
      })
    })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's medicine image.
  getMedicineImage(medicineId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting medicine image byte array from the system.
      this.widthGuideStorageService.getMedicineImage(medicineId).subscribe(medicineImageArray => {
        // Passing the given array.
        res(medicineImageArray)
      }, /** In case of error */ error => { /** passing the error message */ rej(error)
      })
    })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's chores array.
  getTenantChoresArray(tenantId: number): Promise<Chore[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting tenant's chores array from the system.
      this.widthGuideStorageService.getTenantChoresArray(tenantId).subscribe(choresArray => {
        // Passing the given array.
        res(choresArray)
      })
    })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's image.
  getTenantImage(tenantId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting tenant's image byte array from the system.
      this.widthGuideStorageService.getTenantImage(tenantId).subscribe(tenantImage => {
        // Passing the given array.
        res(tenantImage)
      }, /** In case of error */ error => { /** passing the error message */ rej(error)
      })
    });
  }

  // Guide image function :

  // This function is called when widthGuide is pressing on the 'guides' button 
  // in the 'tenants-list' component for displaying each guide image.
  getGuideImage(guideId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting guide's image byte array from the system.
      this.widthGuideStorageService.getGuideImage(guideId).subscribe(guideImage => {
        // Passing the given array.
        res(guideImage)
      }, /** In case of error */ error => { /** passing the error message */ rej(error)
      })
    });
  }

  // Medicine functions:

  // This function is called when widthGuide is creating a new object type Medicine
  // and adding it to tenant's medicine array.
  createNewMedicine(medicine: Medicine, imagefile: File): void {
    // Subscribing to http request for creating & getting the new medicine object from the system.
    this.widthGuideStorageService.createNewMedicine(medicine, this.tenant.id, imagefile)
      .subscribe(medicine => {
        // Referring the new medicine to tenant.
        medicine.tenant = this.tenant
        // Navigating to 'tenant-details' component.
        this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.widthGuideString))

      })
  }

  // This function is called when widthGuide is pressing on the 'submit' button
  // in the form of 'medicine-edit' component.
  updateMedicineDetails(medicine: Medicine, imagefile: File): void {
    // Subscribing to http request for updating & getting the updated medicine details from the system.
    this.widthGuideStorageService.updateMedicineDetails(medicine, imagefile).subscribe(medicine => {
      // Referring the new medicine to tenant.
      medicine.tenant = this.tenant
      // Navigating to 'tenant-details' component.
      this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.widthGuideString))
    })
  }

  // This function is called when widthGuide is deleting medicine from tenant's medicine array
  // (and from the system).
  deleteMedicine(medicine: Medicine): void {
    // Subscribing to http request for deleting medicine.
    this.widthGuideStorageService.deleteMedicine(medicine.id).subscribe(msg => {
      // Displaying operation success message.
      alert(msg)
      // Removing the deleted medicine from tenant medicine array.
      var index = this.tenant.medicine.indexOf(medicine)
      if (index > -1) {
        this.tenant.medicine.splice(index, 1)
      }
    })
  }

  // Chore functions:

  // This function is called when widthGuide is creating a new object type Chore
  // and adding it to tenant's chores array.
  createNewChore(chore: Chore): void {
    // Subscribing to http request for creating & getting the new chore object from the system.
    this.widthGuideStorageService.createNewChore(chore, this.tenant.id).subscribe(chore => {
      // Resetting the chore field.
      this.chore.id = 0
      // Emitting the new chore object.
      this.choreEmitter.emit(chore)
      // Navigating to 'tenant-details' component.
      this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.widthGuideString))
    })
  }

  // This function is called when widthGuide is pressing on the 'submit' button
  // in the form of 'chore-edit' component.
  updateChoreDetails(chore: Chore): void {
    // Subscribing to http request for updating & getting the updated chore details from the system.
    this.widthGuideStorageService.updateChoreDetails(chore)
      .subscribe(chore => {
        // Resetting the chore field.
        this.chore.id = 0
        // Emitting the updated chore object.
        this.choreEmitter.emit(chore)
      })
  }

  // This function is called when widthGuide is deleting chore from tenant's chores array
  // (and from the system).
  deleteChoreFromSystem(chore: Chore): Promise<Chore> {
    return new Promise((res) => {
      // Subscribing to http request for deleting chore.
      this.widthGuideStorageService.deleteChore(chore).subscribe(msg => {
        // displaying operation success message.
        alert(msg)
        // Passing the given deleted chore.
        res(chore)
      })
    })
  }

  // Help functions:

  // This function is for flashing error messages.
  flashErrorMessage(msg: string) {
    AbsServiceClass.prototype.flashErrorMessage.call(this, msg, 5)
  }

  // This function is for setting image byte array as a SafeUrl object.
  setBlobImage(imageByte: number[]): SafeUrl {
    return AbsServiceClass.prototype.setBlobImage.call(this, imageByte, this.sanitizer)
  }

  // This function is called for setting default image in the 'medicine-edit' when adding a new one.
  setDefaultImageFile() {
    this.widthGuideStorageService.setDefaultImageFile().subscribe(file => {
      this.blobEmitter.emit(file)
    })
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
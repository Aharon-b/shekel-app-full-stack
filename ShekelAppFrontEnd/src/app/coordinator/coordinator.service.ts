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
import { Coordinator } from './coordinator.modules';
import { CoordinatorStorageService } from './coordinator.storage.service';

@Injectable()
export class CoordinatorService implements AbsServiceClass {
  // For user type 'Coordinator' in string.
  private coordinatorString: string = PrivateStringsForApp.getCoordinatorEnglishString()
  // For saving coordinator's id (after updating details).
  private coordinatorId: number = 0

  // For displaying coordinator's general details.
  shekelMember: ShekelMember = {} as ShekelMember
  // For displaying apartment details.
  apartment: Apartment = {} as Apartment
  // For displaying tenant details.
  tenant: Tenant = {} as Tenant
  // For displaying medicine details.
  medicine: Medicine = {} as Medicine
  // For displaying chore details.
  chore: Chore = {} as Chore

  // For getting user type Coordinator details.
  userEmitter = new EventEmitter<Coordinator>()
  // For getting chore details.
  choreEmitter = new EventEmitter<Chore>()
  // For getting user type Coordinator's apartments array.
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
  // For setting the kind of replacement in the 'add-replacement-request' component.
  requestOrOfferEmitter = new EventEmitter<boolean>()
  // For showing user type Coordinator image.
  blobEmitter = new EventEmitter<Blob>()
  // For error/success details display purposes.
  msgEmitter = new EventEmitter<string>()
  // For removing guide from array in 'guides-list' component.
  guideEmitter = new EventEmitter<Guide>()

  constructor(
    private loginStorageService: LoginStorageService,
    private coordinatorStorageService: CoordinatorStorageService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  // User functions :

  // This function is called when user type Coordinator is logging to the system, for user details.
  getUserDetails(): void {
    // Subscribing to http request for getting coordinator details.
    this.coordinatorStorageService.getCoordinatorDetails(this.loginStorageService.getToken())
      .subscribe((coordinator: Coordinator) => {
        // Setting the relevant fields from given Coordinator object.
        this.coordinatorId = coordinator.id
        this.shekelMember = coordinator.shekelMember
        // Emitting the Coordinator object.
        this.userEmitter.emit(coordinator)
      })
  }

  // This function is called when user type Coordinator updates his details
  // (for setting username field before navigating to 'edit-user' component).
  getLoggedInUsername(): string {
    return this.loginStorageService.getUsername()
  }

  // This function is called when user type Coordinator is logging to the system, 
  // for checking which component to display ('change-password-display'/'user-start') .
  isPasswordUpdated(): boolean {
    return this.loginStorageService.isPasswordUpdated()
  }

  // This function is called when user type Coordinator is updating is details.
  getUserImage(): Promise<number[]> {

    return new Promise((res) => {
      // Subscribing to http request for getting coordinator image byte array.
      this.coordinatorStorageService.getCoordinatorImage()
        .subscribe(imageByteArray => {
          // Passing user's image byte array.
          res(imageByteArray)
        })
    })
  }

  // This function is called when user type Coordinator is submitting the 'user-edit' component.
  updateUserDetails(shekelMember: ShekelMember, username: string, filename: File): void {
    // Initialize empty type Coordinator object.
    const coordinator = {} as Coordinator
    // Setting updated coordinator details.
    coordinator.id = this.coordinatorId
    coordinator.username = username
    coordinator.shekelMember = shekelMember
    // Subscribing to http request for getting updated coordinator details from the system.
    this.coordinatorStorageService.updateCoordinatorDetails(coordinator, filename)
      .subscribe(coordinator => {
        // For displaying coordinator's general details.
        this.shekelMember = coordinator.shekelMember
        // Subscribing to http request for getting updated coordinator new token 
        // (because if user's username is updated need to get a new token).
        this.loginStorageService.getUserToken(coordinator.username, this.loginStorageService
          .getPassword()).subscribe(token => {
            // Extracting the new token. 
            const newToken = token.headers.get(PrivateStringsForApp.getAuthorizationString())
            // Checking if the new token field is defined.
            if (newToken) {
              // Setting the new token as user's token.
              this.loginStorageService.setToken(newToken)
              // Navigating to user's start page.
              this.navigateByUrl(this.coordinatorString)
            }
          })
      }, error => {
        // If error is because the updated user name is used in the system.
        if (error.status == 409) {
          alert(PrivateStringsForApp.UserNameIsUsedError())
        }
      })
  }

  // This function is called when user type Coordinator is submitting the 'change-password-display' component.
  changeUserPassword(password: string): void {
    // Subscribing to http request for getting operation success message.
    this.coordinatorStorageService.changeCoordinatorPassword(password).subscribe(msg => {
      // Getting the new token (with the new password).
      this.loginStorageService.getUserToken(this.loginStorageService.getUsername(), password)
      // Emitting success message.
      this.msgEmitter.emit(msg)
    })
  }

  // This function is called when user type Coordinator is logging to the system, 
  // for user's apartments array.
  getUserApartments(): void {
    // Subscribing to http request for getting user's apartments array from the system.
    this.coordinatorStorageService.getCoordinatorApartments().subscribe(coordinatorApartmentsArray => {
      // Emitting the given array.
      this.apartmentsEmitter.emit(coordinatorApartmentsArray)
    })
  }

  // This function is called when user type Coordinator is logging to the system, 
  // for user's tenants array.
  getUserTenants(): Promise<Tenant[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting user's tenants array from the system.
      this.coordinatorStorageService.getCoordinatorTenants().subscribe(coordinatorTenants => {
        // Passing the given array to the function that called this function.
        res(coordinatorTenants)
      })
    })
  }

  // Apartment Functions :

  // This function is called when user type Coordinator is pressing on when of the apartments image.
  apartmentDisplay(apartment: Apartment): void {
    // Setting the apartment field for optional operation (deleting/updating apartment details).
    this.apartment = apartment
    // Navigating to 'user-apartment-display'. 
    this.navigateByUrl(PrivateStringsForApp.apartmentDisplayUrl(this.coordinatorString))
  }

  // This function is called when navigating to 'user-apartment-display' 
  // for getting apartment tenants array.
  getApartmentTenants(apartmentId: number): void {
    // Subscribing to http request for getting apartment tenants array from the system.
    this.coordinatorStorageService.getApartmentTenants(apartmentId).subscribe(tenantsArray => {
      // Emitting the given tenants array.
      this.tenantsEmitter.emit(tenantsArray)
    })
  }

  // This function is called when navigating to 'user-start' 
  // for the 'user-apartments-display' component for getting each apartment image.
  getApartmentImage(apartmentId: number): Promise<number[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting apartment image byte array from the system.
      this.coordinatorStorageService.getApartmentImage(apartmentId).subscribe(imageByteArray => {
        // Passing the given image byte array.
        res(imageByteArray)
      })

    })
  }

  // This function is called when coordinator is pressing on the 'guides' button 
  // in the 'user-apartment-display' for getting apartment guides array.
  getApartmentGuides() {
    // Subscribing to http request for getting apartment guides array from the system.
    this.coordinatorStorageService.getApartmentGuides(this.apartment.id).subscribe(guidesArray => {
      // Emitting the given array.
      this.guidesEmitter.emit(guidesArray)
    })
  }

  // This function is called when coordinator is pressing on the 'update' button 
  // in the 'user-apartment-display' component.
  updateApartmentDetails(apartment: Apartment, filename: File): Promise<any> {
    return new Promise((res, rej) => {
      // Subscribing to http request for updating apartment details in the system.
      this.coordinatorStorageService.updateApartmentDetails(apartment, filename)
        .subscribe(responseApartment => {
          // Passing the updated apartment.
          res(responseApartment)
        }, /** In case of error */ error => {
          /** checking if error is a conflict error  */
          if (error.status == 409) {
            rej(PrivateStringsForApp.nameIsUsedError(apartment.name))
          } else {
            rej(error.error.message)
          }
        })
    })
  }

  // This function is called when coordinator is deleting apartment from his apartments array. 
  deleteApartmentFromCoordinatorArray(apartment: Apartment) {
    // Subscribing to http request for deleting apartment 
    // from coordinator's apartments array in the system.
    this.coordinatorStorageService.deleteApartmentFromCoordinatorList(apartment.id).subscribe(msg => {
      // Emitting the operation success message.
      this.msgEmitter.emit(msg)
    })
  }

  // Tenant Functions:

  // This function is called when user type Coordinator is pressing 
  // on one of the tenants in the 'apartments-list' component.
  getTenantPersonalDetails(tenant: Tenant): void {
    // Setting the tenant field for optional operation (deleting/updating tenant details).
    this.tenant = tenant
    // Navigating to 'tenant-details' component.
    this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString))
  }

  // This function is called when coordinator is pressing on the 'submit' button
  // in the form of 'tenant-edit' component.
  updateTenantDetails(tenant: Tenant, filename: File): void {
    // Subscribing to http request for updating tenant details in the system.
    this.coordinatorStorageService.updateTenantDetails(tenant, filename).subscribe(tenant => {
      // Setting the tenant field.
      this.tenant = tenant
      // Refreshing the 'tenant-details' component for displaying the new tenant details.
      this.doubleNavigateWithTimeOut(this.coordinatorString,
        PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString), 200)
    })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's medicine array.
  getTenantMedicineArray(tenantId: number): Promise<Medicine[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting tenant's medicine array from the system.
      this.coordinatorStorageService.getTenantMedicineArray(tenantId).subscribe(medicineArray => {
        // Passing the given array.
        res(medicineArray)
      })
    })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's chores array.
  getTenantChoresArray(tenantId: number): Promise<Chore[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting tenant's chores array from the system.
      this.coordinatorStorageService.getTenantChoresArray(tenantId).subscribe(choresArray => {
        // Passing the given array.
        res(choresArray)
      })
    })
  }

  // This function is called when navigating to 'tenant-details'/'edit-tenant' components
  //  for displaying tenant's image.
  getTenantImage(tenantId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting tenant's image byte array from the system.
      this.coordinatorStorageService.getTenantImage(tenantId).subscribe(tenantImageArray => {
        // Passing the given array.
        res(tenantImageArray)
      }, /** In case of error */ error => { /** passing the error message */ rej(error)
      })
    })
  }

  // This function is called when coordinator is deleting a tenant from apartment tenants array.
  deleteTenantFromApartment(tenantId: number): void {
    // Subscribing to http request for deleting tenant from apartment tenants array.
    this.coordinatorStorageService.deleteTenantFromApartment(tenantId).subscribe(msg => {
      // Emitting the success operation message.
      this.msgEmitter.emit(msg)
    }, /** In case of error */ error => {
      // Checking if error is conflict error 
      if (error.status === 404 || 409) {
        // Emitting error message 
        // ('tenant ...(first name) is not in one of ...(coordinator name) apartments').
        const err = JSON.parse(JSON.stringify(error.error))
        this.msgEmitter.emit(JSON.parse(err).message)
      }
    })
  }

  // Medicine functions :

  // This function is called when coordinator is creating a new object type Medicine
  // and adding it to tenant's medicine array.
  createNewMedicine(medicine: Medicine, imagefile: File): void {
    // Subscribing to http request for creating & getting the new medicine object from the system.
    this.coordinatorStorageService.createNewMedicine(medicine, this.tenant.id, imagefile)
      .subscribe(medicine => {
        // Referring the new medicine to tenant.
        medicine.tenant = this.tenant
        // Resting medicine field.
        this.medicine.id = 0
        // Navigating to 'tenant-details' component.
        this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString))
      })
  }

  // This function is called when navigating to 'tenant-details' component
  //  for displaying tenant's medicine image.
  getMedicineImage(medicineId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting medicine image byte array from the system.
      this.coordinatorStorageService.getMedicineImage(medicineId).subscribe(medicineImageArray => {
        // Passing the given array.
        res(medicineImageArray)
      }, /** In case of error */ error => { /** passing the error message */ rej(error)
      })
    })
  }

  // This function is called when coordinator is pressing on the 'submit' button
  // in the form of 'medicine-edit' component.
  updateMedicineDetails(medicine: Medicine, imagefile: File): void {
    // Subscribing to http request for updating & getting the updated medicine details from the system.
    this.coordinatorStorageService.updateMedicineDetails(medicine, imagefile)
      .subscribe(medicine => {
        // Referring the updated medicine to tenant.
        medicine.tenant = this.tenant
        // Resting medicine field.
        this.medicine.id = 0
        // Navigating to 'tenant-details'.
        this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString))
      })
  }

  // This function is called when coordinator is deleting medicine from tenant's medicine array
  // (and from the system).
  deleteMedicine(medicine: Medicine): void {
    // Subscribing to http request for deleting medicine.
    this.coordinatorStorageService.deleteMedicine(medicine.id).subscribe(msg => {
      // displaying operation success message.
      alert(msg)
      // Navigating to 'tenant-details' component.
      AbsServiceClass.doubleNavigate(this.coordinatorString,
        PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString), this.router)
    })
  }

  // Chore functions :

  // This function is called when coordinator is creating a new object type Chore
  // and adding it to tenant's chores array.
  createNewChore(chore: Chore): void {
    // Subscribing to http request for creating & getting the new chore object from the system.
    this.coordinatorStorageService.createNewChore(chore, this.tenant.id).subscribe(chore => {
      // Resetting the chore field.
      this.chore.id = 0
      // Emitting the new chore object.
      this.choreEmitter.emit(chore)
      // Navigating to 'tenant-details' component.
      this.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.coordinatorString))
    })
  }

  // This function is called when coordinator is pressing on the 'submit' button
  // in the form of 'chore-edit' component.
  updateChoreDetails(chore: Chore): void {
    // Subscribing to http request for updating & getting the updated chore details from the system.
    this.coordinatorStorageService.updateChoreDetails(chore)
      .subscribe(chore => {
        // Resetting the chore field.
        this.chore.id = 0
        // Emitting the updated chore object.
        this.choreEmitter.emit(chore)
      })
  }

  // This function is called when coordinator is deleting chore from tenant's chores array
  // (and from the system).
  deleteChoreFromSystem(chore: Chore): Promise<Chore> {
    return new Promise((res) => {
      // Subscribing to http request for deleting chore.
      this.coordinatorStorageService.deleteChore(chore).subscribe(msg => {
        // displaying operation success message.
        alert(msg)
        // Passing the given deleted chore.
        res(chore)
      })
    })
  }

  // Guide functions:

  // This function is called when coordinator is pressing on the 'guides' button 
  // in the 'tenants-list' component for displaying each guide details.
  getGuideDetails(guideId: number): Promise<Guide> {
    return new Promise((res) => {
      // Subscribing to http request for getting guide's details from the system.
      this.coordinatorStorageService.getGuideDetails(guideId).subscribe(guide => {
        // Passing the given guide object.
        res(guide)
      })
    })
  }

  // This function is called when coordinator is pressing on the 'guides' button 
  // in the 'tenants-list' component for displaying each guide image.
  getGuideImage(guideId: number): Promise<number[]> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting guide's image byte array from the system.
      this.coordinatorStorageService.getGuideImage(guideId).subscribe(guideImageArray => {
        // Passing the given array.
        res(guideImageArray)
      }, /** In case of error */ error => { /** Passing the error message */ rej(error)
      })
    })
  }

  // This function is called when coordinator is pressing on the plus button in the 
  // 'apartment-guides' component for getting all guides in the system (or in case that the 
  // apartment gender == 'GIRLS' only the guides with the same gender).
  getAllGuides(): void {
    // Subscribing to http request for getting all guides from the system.
    this.coordinatorStorageService.getAllGuides(this.apartment).subscribe(allGuidesArray => {
      // Emitting the given array.
      this.guidesEmitter.emit(allGuidesArray)
    })
  }

  // This function is called when coordinator is adding a guide from the system to the
  // apartment guides array.
  addGuideFromSystemToApartment(guide: Guide): Promise<Guide> {
    return new Promise((res, rej) => {
      // Subscribing to http request for adding guide to apartment array
      // & getting the added guide details from the system.
      this.coordinatorStorageService.addGuideFromSystemToApartment(guide, this.apartment.id)
        .subscribe(guide => {
          // Passing the given guide object.
          res(guide)
        }, error => rej(error.error.message))
    })
  }

  // This function is called when coordinator is deleting guide from guides apartment array.
  removeGuideFromApartment(guide: Guide): void {
    // Subscribing to http request for deleting guide from guides apartment array.
    this.coordinatorStorageService.removeGuideFromApartment(guide.id, this.apartment.id)
      .subscribe(() => {
        // Emitting the removed guide.
        this.guideEmitter.emit(guide)
      })
  }

  // Replacement functions :

  // This function is called when navigating to 'coordinator-start' component for getting all 
  // of the replacements to approve array.
  getCoordinatorApprovalArray(): Promise<[]> {
    return new Promise((res) => {
      // Subscribing to http request for getting coordinator approval array.
      this.coordinatorStorageService.getCoordinatorApprovalArray()
        .subscribe(coordinatorApprovalArray => {
          // Passing the given array.
          res(coordinatorApprovalArray)
        })
    })
  }

  // This function is called when coordinator is pressing on the green (approve) button in one of the 
  // replacements to approve table.
  approveReplacementRequest(guideId: number, replacementRequestId: number): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting the 'replacement was approved' success message.
      this.coordinatorStorageService.approveReplacementRequest(guideId, replacementRequestId)
        .subscribe(successMsg => {
          // Passing the operation success message.
          res(successMsg)
        }, /** In case of error */ error => { /** Passing the error message */ rej(error)
        })
    });
  }

  // This function is called when coordinator is pressing on the red (reject) button in one of the 
  // replacements to approve table.
  rejectedReplacementRequest(guide: Guide, replacementRequestId: number): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting the 'replacement was rejected' success message.
      this.coordinatorStorageService.rejectReplacementRequest(guide, replacementRequestId)
        .subscribe(rejectOfferMsg => {
          // Passing the operation success message.
          res(rejectOfferMsg)
        }, /** In case of error */ error => { /** Passing the error message */ rej(error.error.message)
        })
    });
  }

  // This function is called when user type Coordinator is adding a new replacement to the system.
  addReplacementToUserArray(replacementRequest: Replacement): Promise<Replacement> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting the new replacement object from the system.
      this.coordinatorStorageService
        .addApartmentReplacementFromCoordinatorApartmentsToSystem(replacementRequest)
        .subscribe(replacementRequest => {
          // Passing the given Replacement.
          res(replacementRequest)
        }/** In case of error */, error => { rej(error) })
    })
  }

  // Help functions :

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
    this.coordinatorStorageService.setDefaultImageFile().subscribe(file => {
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

  // This function is for refreshing a component after a certain operations .
  doubleNavigateWithTimeOut(firstUrl: string, secondUrl: string, milliSecondes: number) {
    this.router.navigateByUrl(firstUrl, { skipLocationChange: true }).then(() => {
      setTimeout(() => {
        this.navigateByUrl(secondUrl)
      }, milliSecondes);
    })
  }

}
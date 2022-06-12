import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apartment } from '../apartment/apartment.modules';
import { ShekelMember } from '../common/main-objects/shekelMember.modules';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { Coordinator } from '../coordinator/coordinator.modules';
import { Guide } from '../guide/guide.modules';
import { LoginStorageService } from '../login/login-storage-service';
import { Tenant } from '../tenant/tenant.modules';
import { WidthGuide } from '../width-guide/width-guide-modules';
import { AdminStorageService } from './admin.storage.service';

@Injectable()
export class AdminService {
  // For user type 'Admin' in string.
  private adminString: string = PrivateStringsForApp.getEnglishAdminString()

  // For coordinators details display purposes.
  coordinatorsEmitter = new EventEmitter<Coordinator[]>()
  // For width-guides details display purposes.
  widthGuidesEmitter = new EventEmitter<WidthGuide[]>()
  // For guides details display purposes.
  guidesEmitter = new EventEmitter<Guide[]>()
  // For apartments details display purposes.
  apartmentsEmitter = new EventEmitter<Apartment[]>()
  // For tenants details display purposes.
  tenantsEmitter = new EventEmitter<Tenant[]>()

  // For error/success details display purposes.
  msgEmitter = new EventEmitter<string>()
  // For getting admin new username after updating it.
  adminUsernameEmitter = new EventEmitter<string>()
  // For display purposes.
  positionEmitter = new EventEmitter<string>()
  // For display purposes.
  showOptionsBooleanEmitter = new EventEmitter<boolean>()
  // For showing/heading 'edit-admin' component.
  showEditBooleanEmitter = new EventEmitter<boolean>()
  // For checking if user needs to update is default password.
  passwordUpdateEmitter = new EventEmitter<boolean>()
  // For images display.
  blobEmitter = new EventEmitter<Blob>()

  // For 'user-edit' component when adding a new guide(for showing 'gender' field).
  addingGuide: boolean = false
  // For 'user-edit' component when adding a new width-guide(for showing 'all coordinators with no width guide' field).
  addingWidthGuide: boolean = false

  constructor(private adminStorageService: AdminStorageService,
    private router: Router,
    private loginStorageService: LoginStorageService
  ) { }

  // Admin functions:

  // This function is called when user is creating a new user type Admin.
  addAdminToSystem(username: string): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for adding a new user type admin to the system.
      this.adminStorageService.addAdminToSystem(username).subscribe(newAdminUsername => {
        // Passing the success message.
        res(newAdminUsername)
      },/** In case of error */ error =>/** passing the error message */ { rej(error) })
    })
  }

  // This function is called when user type Admin updates his details.
  updateAdminDetails(username: string, password: string): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for updating a user type admin details.
      this.adminStorageService.updateAdminDetails(username, password).subscribe(stringMsg => {
        /**  In case of updating password two times in a row getting user's password */
        var passwordToSend
        if (password == PrivateStringsForApp.getEmptyString()) {
          passwordToSend = this.loginStorageService.getPassword()
        } else {
          passwordToSend = password
        }
        // Subscribing to http request for getting the new token after updating details.
        this.loginStorageService.getUserToken(username, passwordToSend).subscribe(token => {
          // For the new token with the updated details.
          const newToken = token.headers.get(PrivateStringsForApp.getAuthorizationString())
          // Checking if getting a validated token from back-end
          if (newToken) {
            // Setting the new token in the 'loginStorageService' class for future operations.
            this.loginStorageService.setToken(newToken)
            // For setting the new token in the 'adminStorageService' class for future operations.
            this.setToken()
            // Passing the success message to the function that is calling this function.
            res(stringMsg)
          }
        })
      },/** In case of error */ error =>/** Passing the error message */ { rej(error) })
    })
  }

  // This function is called when user type Admin updates his password.
  changeAdminPassword(password: string): void {
    // Subscribing to http request for getting the success message after updating default password.
    this.adminStorageService.changeAdminPassword(password).subscribe(msg => {
      // Emitting the success message.
      this.msgEmitter.emit(msg)
    })
  }

  // This function is called when user type Admin updates his details(for setting username field before navigating to 'edit-admin' component).
  getAdminUsername(): Subscription {
    // Subscribing to http request for getting user's current username.
    return this.adminStorageService.getAdminUsername().subscribe(username => {
      // Emitting the given username from back-end.
      this.adminUsernameEmitter.emit(username)
    })

  }

  // When user type admin deletes is account from the system, this function is called.
  deleteAdminAccountFromSystem(): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting success message after deleting the account.
      this.adminStorageService.deleteAdminAccountFromSystem().subscribe(msg => {
        // Passing the success message.
        res(msg)
      },/** In case of error  */ error => /** passing the error message */ { rej(error) })
    })

  }

  // Coordinator functions:

  // This function is called when user is creating a new user type Coordinator.
  createNewCoordinator(shekelMember: ShekelMember, username: string, filename: File): void {
    // Initialize empty type Coordinator object.
    const coordinator: Coordinator = {} as Coordinator
    // Coordinator class extends Worker class.
    coordinator.username = username
    coordinator.shekelMember = shekelMember
    // Subscribing to http request for creating new Coordinator object. 
    this.adminStorageService.createNewCoordinator(coordinator, filename).subscribe(() => {
      // Navigating to the new object list page.
      this.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_4_MenuSpot(),
        PrivateStringsForApp.getAllFromObjectType(this.adminString,
          PrivateStringsForApp.getCoordinatorEnglishPluralString()))
    })
  }

  // When user type Admin presses on the 'all-coordinators' choice in the 
  // main menu, this function is called.
  getAllCoordinators(): void {
    // Subscribing to http request for getting all of the coordinators in the system.
    this.adminStorageService.getAllCoordinators().subscribe(allCoordinatorsArray => {
      // Emitting the given coordinators array from back-end.
      this.coordinatorsEmitter.emit(allCoordinatorsArray)
    })
  }

  // When user type Admin presses on the 'all-coordinators' choice in the 
  // main menu, this function is called for displaying etch coordinator apartments.
  getCoordinatorApartments(coordinator: Coordinator): void {
    // Referring coordinator apartments array to an empty object array.
    coordinator.apartments = []
    // Subscribing to http request for getting coordinator apartments.
    this.adminStorageService.getCoordinatorApartments(coordinator.id).subscribe(coordinatorApartmentsArray => {
      // Referring the given apartments array to coordinator apartments array.
      coordinator.apartments = coordinatorApartmentsArray
    })
  }

  // When user type Admin presses on the connects between apartment with no coordinator 
  // to one of the coordinators in the system ,this function is called.
  addApartmentToCoordinator_sArray(apartment: Apartment, coordinator: Coordinator): void {
    // Subscribing to http request for setting the given apartment coordinator id as the given coordinator id.
    this.adminStorageService.addCoordinatorToApartment(apartment.id, coordinator).subscribe(() => {
      // Emitting the apartment's & coordinator's name success message.  
      this.msgEmitter.emit(PrivateStringsForApp.apartmentIsAddedToUsersListMsg(apartment.name, coordinator.shekelMember))
    }, /** In case of error, emitting the 'system can't complete operation, try again later*/() => {
      this.msgEmitter.emit(PrivateStringsForApp.tryAgainLaterMsg())
    })
  }

  // When user type Admin presses on the 'all-coordinators-with-no-width-guide' choice in the 
  // main menu, this function is called for displaying all coordinators in the system with no width-guide.
  getAllCoordinatorsNoWidthGuide(): void {
    // Subscribing to http request for getting all coordinators in the system with no width-guide.
    this.adminStorageService.getAllCoordinatorsNoWidthGuide().subscribe(allCoordinatorsNoWidthGuide => {
      // Emitting the given coordinators array from back-end.
      this.coordinatorsEmitter.emit(allCoordinatorsNoWidthGuide)
    })
  }

  // When user type Admin is deleting a coordinator from the system, this function is called. 
  deleteCoordinatorFromSystem(coordinatorId: number): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting success message after deleting coordinator's account.
      this.adminStorageService.deleteCoordinatorFromSystem(coordinatorId).subscribe(msg => {
        // Passing the success message.
        res(msg)
      },/** In case of error */ error => /** passing the error message. */ { rej(error) })
    })
  }


  /**  Width-guide functions */

  // This function is called when user is creating a new user type WidthGuide.
  addNewWidthGuide(shekelMember: ShekelMember, username: string, coordinatorId: number): Promise<WidthGuide> {
    // Initialize empty type WidthGuide object.
    const widthGuide: WidthGuide = {} as WidthGuide;
    // WidthGuide class extends Worker class.
    widthGuide.shekelMember = shekelMember
    widthGuide.username = username

    return new Promise((res, rej) => {
      // Subscribing to http request for creating new WidthGuide object. 
      this.adminStorageService.addNewWidthGuide(widthGuide, coordinatorId).subscribe(widthGuide => {
        // Passing the created WidthGuide object.
        res(widthGuide)
      },/** In case of error */ error =>/** Passing the error message */ { rej(error) })
    })
  }

  // When user type Admin presses on the 'all-width-guides' choice in the 
  // main menu, this function is called.
  getAllWidthGuides(): void {
    // Subscribing to http request for getting all of the width-guides in the system.
    this.adminStorageService.getAllWidthGuides().subscribe(allWidthGuidesArray => {
      // Emitting the given width-guides array from back-end.
      this.widthGuidesEmitter.emit(allWidthGuidesArray)
    })
  }

  // When user type Admin presses on the 'all-width-guides' choice in the 
  // main menu, this function is called for displaying etch width-guide's coordinator.
  getWidthGuideCoordinator(widthGuide: WidthGuide): void {
    // Subscribing to http request for getting width-guide coordinator object.
    this.adminStorageService.getWidthGuideCoordinator(widthGuide.id).subscribe(coordinator => {
      // Referring the given coordinator object to width-guide's coordinator field.
      widthGuide.coordinator = coordinator
    })
  }

  // When user type Admin is adding for a guide a WIDTH_GUIDE role, this function is called.
  addGuideAsWidthGuide(coordinatorId: number, guide: Guide, phoneNumber: string): Promise<WidthGuide> {
    return new Promise((res, rej) => {
      // Subscribing to http request for adding to guide 'WIDTH_GUIDE' role & to connect between width guide and coordinator by coordinatorId.
      this.adminStorageService.addGuideAsWidthGuide(coordinatorId, guide, phoneNumber).subscribe(widthGuide => {
        // Passing the given width-guide.
        res(widthGuide)
      },/** In case of error  */ error => /** passing the error message */ { rej(error) })
    })
  }

  // When user type Admin is deleting a width-guide from the system, this function is called. 
  deleteWidthGuideFromSystem(widthGuide: WidthGuide): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting success message after deleting width-guide from the system.
      this.adminStorageService.deleteWidthGuideFromSystem(widthGuide.id).subscribe(msg => {
        // Passing the success message.
        res(msg)
      },/** In case of error  */ error => /** passing the error message */ { rej(error) })
    })
  }

  // Guide functions:

  // This function is called when user is creating a new user type Guide.
  createNewGuide(shekelMember: ShekelMember, username: string, filename: File): void {
    // Initialize empty type Guide object.
    const guide: Guide = {} as Guide
    // Guide class extends Worker class.
    guide.username = username
    guide.shekelMember = shekelMember
    // Subscribing to http request for creating new Guide object
    this.adminStorageService.createNewGuide(guide, filename).subscribe(() => {
      // Navigating to the new object list page.
      this.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_3_MenuSpot(),
        PrivateStringsForApp.getAllFromObjectType(this.adminString,
          PrivateStringsForApp.getGuideEnglishPluralString()))
    })
  }

  // When user type Admin presses on the 'all-guides' choice in the 
  // main menu, this function is called.
  getAllGuides(): void {
    // Subscribing to http request for getting all of the guides in the system.
    this.adminStorageService.getAllGuidesInTheSystem().subscribe(allGuidesInSystemArray => {
      // Emitting the given guides array from back-end.
      this.guidesEmitter.emit(allGuidesInSystemArray)
    })
  }

  // When user type Admin presses on the 'all-guides' choice in the 
  // main menu, this function is called for displaying etch guide apartments.
  getGuideApartments(guide: Guide): void {
    // Referring guide apartments array to an empty object array.
    guide.apartments = []
    // Subscribing to http request for getting guide apartments.
    this.adminStorageService.getGuideApartments(guide.id).subscribe(guideApartmentsArray => {
      // Referring the given apartments array to guide apartments array.
      guide.apartments = guideApartmentsArray
    })
  }

  // When user type Admin presses on the 'all-guides-with-no-apartments' choice in the 
  // main menu, this function is called for displaying all guides in the system with no apartment.
  getAllGuidesWithNoApartments(): void {
    // Subscribing to http request for getting all guides in the system with no apartments.
    this.adminStorageService.getAllGuideWithNoApartments().subscribe(allGuidesWithNoApartment => {
      // Emitting the given guides array from back-end.
      this.guidesEmitter.emit(allGuidesWithNoApartment)
    })
  }

  // From the 'all-guides-with-no-apartments' choice in the main menu,
  // if user type Admin is adding apartment to guide's list, this function is called. 
  addApartmentToGuide_sArray(guide: Guide, apartment: Apartment): void {
    this.adminStorageService.addApartmentToGuide(guide.id, apartment.id).subscribe(() => {
      // Emitting the apartment's & guide's name success message. 
      this.msgEmitter.emit(PrivateStringsForApp.apartmentIsAddedToUsersListMsg(apartment.name, guide.shekelMember))
    }, /** In case of error, emitting the 'system can't complete operation, try again later*/() => {
      this.msgEmitter.emit(PrivateStringsForApp.tryAgainLaterMsg())
    })
  }

  // From the 'all-width-guides' choice in the main menu,
  // if user type Admin is adding to guide a WIDTH_GUIDE role, this function is called.
  allGuidesThatAreNotWidthGuides(): void {
    // Subscribing to http request for getting all of the guide's in the system that doesn't have 'WIDTH_GUIDE' role.
    this.adminStorageService.getAllGuidesThatAreNotWidthGuides().subscribe(getAllGuidesThatAreNotWidthGuides => {
      // Emitting the given guides array from back-end.
      this.guidesEmitter.emit(getAllGuidesThatAreNotWidthGuides)
    })
  }

  // When user type Admin is deleting a guide from the system, this function is called.
  deleteGuideFromSystem(guide: Guide): void {
    // Subscribing to http request for getting success message after deleting guide's account.
    this.adminStorageService.deleteGuideFromSystem(guide.id).subscribe(msg => {
      // Emitting the success message.
      this.msgEmitter.emit(msg)
    })
  }

  // Apartment functions:

  // This function is called when user is creating a new object type Apartment.
  createNewApartment(apartment: Apartment, filename: File): void {
    // Subscribing to http request for creating new Apartment object. 
    this.adminStorageService.createNewApartment(apartment, filename).subscribe(() => {
      // Navigating to the new object list page.
      this.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_1_MenuSpot(), this.adminString)
    },/** In case of error */ error => {/** Flashing the error message on the screen  */ this.flashErrorMessage(error.error.message, 5)
    })
  }

  // When user type Admin presses on the 'all-guides' choice in the 
  // main menu or logs in to the system, this function is called.
  getAllApartments(): void {
    // Subscribing to http request for getting all of the apartments in the system.
    this.adminStorageService.getAllApartments().subscribe(apartmentsList => {
      // Emitting the given apartments array from back-end.
      this.apartmentsEmitter.emit(apartmentsList)
    })
  }

  // From the 'all-tenants-with-no-apartment' choice in the main menu,
  // this function is called for displaying all of the apartments 
  // with the same gender as tenant.
  getSystemApartmentsWithTenantGender(tenant: Tenant): void {
    // Subscribing to http request for getting all of the apartments in the system with the same gender as tenant.
    this.adminStorageService.getSystemApartments(tenant).subscribe(apartmentsInSystemArray => {
      // Emitting the given apartments array from back-end.
      this.apartmentsEmitter.emit(apartmentsInSystemArray)
    })
  }

  // From the 'all-tenants-with-no-apartment' choice in the main menu,
  // if user type Admin is adding a tenant to apartment's list, this function is called.
  addTenantToApartment(tenantId: number, apartmentId: number): void {
    // Subscribing to http request for setting the given tenant's apartment id as the given apartment id.
    this.adminStorageService.addTenantToApartment(tenantId, apartmentId).subscribe(() => {
      // Navigating to 'all-tenants-in-system' component.
      // this.navigateToNewObjectPageList('second', 'admin/all-tenants-in-system')
      this.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_2_MenuSpot(),
        PrivateStringsForApp.getAllFromObjectType(this.adminString,
          PrivateStringsForApp.getTenantEnglishPluralString()))
    })
  }

  // When user type Admin presses on the 'all-apartments-with-no-coordinator' 
  // choice in the main menu, this function is called.
  getAllApartmentsWithNoCoordinator(): void {
    // Subscribing to http request for getting all of the apartments in the system with no coordinator.
    this.adminStorageService.getAllApartmentsWithNoCoordinator().subscribe(allApartmentsNoCoordinator => {
      // Emitting the given apartments array from back-end.
      this.apartmentsEmitter.emit(allApartmentsNoCoordinator)
    })
  }

  // When user type Admin is deleting apartment from the system, this function is called.
  deleteApartmentFromSystem(apartment: Apartment): void {
    // Subscribing to http request for getting success message after deleting apartment from the system.
    this.adminStorageService.deleteApartmentFromSystem(apartment.id).subscribe(msg => {
      // Emitting the success message.
      this.msgEmitter.emit(msg)
    })
  }

  // Tenant functions:

  // This function is called when user is creating a new object type Tenant.
  createNewTenant(tenant: Tenant, filename: File): void {
    // Subscribing to http request for creating new Tenant object.
    this.adminStorageService.createNewTenant(tenant, filename).subscribe(() => {
      // Navigating to the new object list page.
      this.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_2_MenuSpot(),
        PrivateStringsForApp.getAllFromObjectType(this.adminString,
          PrivateStringsForApp.getTenantEnglishPluralString()))
    })
  }

  // When user type Admin presses on the 'all-tenants' choice in the 
  // main menu or logs in to the system, this function is called.
  getAllTenants(): void {
    // Subscribing to http request for getting all of the tenants in the system.
    this.adminStorageService.getAllTenants().subscribe(tenantsList => {
      // Emitting the given tenants array from back-end.
      this.tenantsEmitter.emit(tenantsList)
    })
  }

  // When user type Admin presses on the 'all-tenants-with-no-apartment' 
  // choice in the main menu, this function is called.
  getAllTenantsWithNoApartment(): void {
    // Subscribing to http request for getting all of the tenants in the system with no apartment.
    this.adminStorageService.getAllTenantsWithNoApartment().subscribe(allTenantsWithNoApartment => {
      // Emitting the given tenants array from back-end.
      this.tenantsEmitter.emit(allTenantsWithNoApartment)
    })
  }

  // When user type Admin presses on the 'all-tenants' choice in the 
  // main menu, this function is called for displaying etch tenant apartment name.
  getTenantApartmentName(tenant: Tenant): void {
    // Subscribing to http request for getting tenant's apartment object.
    tenant.apartment = {} as Apartment
    this.adminStorageService.getTenantApartmentName(tenant.id).subscribe(tenant_sApartment => {
      // Referring the given apartment object to width-guide's coordinator field.
      tenant.apartment.name = tenant_sApartment
    })
  }

  // When user type Admin is deleting tenant from the system, this function is called.
  deleteTenantFromSystem(tenant: Tenant): Promise<string> {
    return new Promise((res, rej) => {
      // Subscribing to http request for getting success message after deleting tenant from the system.
      this.adminStorageService.deleteTenantFromSystem(tenant.id).subscribe(msg => {
        // Passing the success message.
        res(msg)
      },/** In case of error  */ error => /** passing the error message */ { rej(error) })
    })
  }

  // Help functions:

  // When user type Admin wants to add a Coordinator or Guide or Apartment
  // or Tenant type to the system ,for displaying the default image field,
  // this function is called. 
  setDefaultImageFile() {
    this.adminStorageService.setDefaultImageFile().subscribe(imagefile => {
      this.blobEmitter.emit(imagefile)
    })
  }

  // When user type Admin logs in to the system or updates is 
  // details, this function is called.   
  setToken(): void {
    this.adminStorageService.setToken(this.loginStorageService.getToken())
  }

  // When there is a error on one of the operations that user type Admin
  // does ,if there is a error this function is called for displaying the error's message.
  flashErrorMessage(msg: string, times: number) {

    const intervalId = setInterval(() => {
      this.msgEmitter.emit(msg)
      times--
      if (times === 0) {
        clearInterval(intervalId)
      }
    }, 1500)
  }

  // For preventing entry to the system from the url segment, 
  // when user type Admin enters the system,this function is called.
  checkLoginFields(): boolean {
    return this.loginStorageService.checkLoginFields()
  }

  // When user type Admin logs in,this function is called 
  // for checking if is password is updated or still is the
  // default password.
  isPasswordUpdated(): boolean {
    return this.loginStorageService.isPasswordUpdated()
  }

  // This function is called when user type Admin 
  // navigates between components.
  navigateByUrl(url: string): void {
    this.router.navigateByUrl(url)
  }

  // This function is called after user type Admin 
  // adds a new object to the system , for navigating 
  // to the new object list page.
  navigateToNewObjectPageList(positionEmitterString: string, urlString: string): void {
    this.positionEmitter.emit(positionEmitterString)
    this.navigateByUrl(urlString)
  }

  // For lighting the first choice in the main menu
  // when navigating to the 'all-apartments' component.
  emitFirstPosition(): void {
    this.positionEmitter.emit(PrivateStringsForApp.getAdmin_1_MenuSpot())
  }

  // When user type Admin logs out from the system,
  // this function is called.
  resetLoginFields(): void {
    this.loginStorageService.resetLoginFields()
  }

}
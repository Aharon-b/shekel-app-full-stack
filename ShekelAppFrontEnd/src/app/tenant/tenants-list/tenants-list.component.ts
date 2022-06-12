import { Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { GuideService } from 'src/app/guide/guide.service';
import { Tenant } from '../tenant.modules';

@Component({
  selector: 'app-tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.css']
})
export class TenantsListComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // Initialize empty object of type Tenant[] for all apartment tenants.
  tenantsArray: Tenant[] = []
  // Initialize empty object of type Apartment.
  apartment: Apartment = {} as Apartment
  // For disabling the 'go back' button until all details in the component are displayed.
  backButtonDisplay: boolean = false
  // For displaying/hiding the 'guides' button.
  displayApartmentGuidesArray: boolean = false

  // For displaying error messages.
  errorMsg: string = this.emptyString
  // For displaying 'tenant is deleted from apartment's list' success messages.
  tenantDeletedDisplayMsg: string = this.emptyString
  // For operations in the component.
  loginType: string = this.emptyString
  // In case user Coordinator type is deleting tenant from apartment's tenants array.
  tenantIndex: number = -1

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private elementRef: ElementRef
  ) {
    this.loginType = userTypeService.getUserTypeString()
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Hiding the 'user-start' component.
    this.absService.showStartPageElementsEmitter?.emit(false)
    // Closing the 'guides-list' component (in case it's open).
    this.toDisplayApartmentGuidesArray()

    // Referring the apartment filed to the AbsServiceClass apartment field.
    this.apartment = this.absService.apartment
    // Getting apartment tenants.
    this.absService.getApartmentTenants(this.apartment.id)
    this.absService.tenantsEmitter.subscribe(tenantsArray => {
      // Referring the emitted array to the tenantsArray field.
      this.tenantsArray = tenantsArray
      // abling the 'go back' button.
      this.backButtonDisplay = true
    })
    // Subscribing to the message emitter in the AbsServiceClass.
    this.absService.msgEmitter.subscribe(msg => {
      // For checking if the emitted message as the removed tenant's first name. 
      const tenant = this.tenantsArray[this.tenantIndex]
      // Checking if the message is success deleting tenant from apartment's tenants array.
      if (tenant.shekelMember.firstName === msg.substring(0, tenant.shekelMember.firstName.length)) {
        // If so, removing deleted tenant from the tenantsArray field.
        this.tenantsArray.splice(this.tenantIndex, 1);
        // Displaying the success message.
        this.tenantDeletedDisplayMsg = msg
        // Resetting the tenantIndex field.
        this.tenantIndex = -1
      } else {
        // If not, the message is an error message.
        this.errorMsg = msg
      }
      setTimeout(() => {
        // In any case, resetting all kind of message elements.
        this.tenantDeletedDisplayMsg = this.emptyString
        this.errorMsg = this.emptyString
      }, 3000);
    })

  }

  ngAfterViewInit(): void {
    // Page color.
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgb(89, 200, 204)'
  }

  // This function is called when user type Coordinator/WidthGuide is 
  // pressing on the 'guides' button.
  guidesDisplay() {
    // Hiding the 'guides' button.
    this.displayApartmentGuidesArray = false
    // Navigating to the 'guides-list' component.
    this.absService.navigateByUrl(
      PrivateStringsForApp.apartmentDisplayUrl(this.loginType) +
      PrivateStringsForApp.getSlash() +
      PrivateStringsForApp.getApartmentEnglishString() +
      PrivateStringsForApp.getHyphen() +
      PrivateStringsForApp.getGuideEnglishPluralString()
    )
  }

  // This function is called when user type Coordinator/WidthGuide is 
  // pressing on the 'close' button ("closing" the 'guides-list' component).
  closeGuidesDisplay() {
    // Showing the 'guides' button.
    this.displayApartmentGuidesArray = true
    // Navigating back to the component.
    this.absService.navigateByUrl(PrivateStringsForApp.apartmentDisplayUrl(this.loginType))

  }

  // This function is called when user type Coordinator is 
  // pressing on the 'update' button.
  updateApartmentDetails() {
    // Navigating to the 'apartment-edit' component.
    this.absService.navigateByUrl(
      PrivateStringsForApp.navigateToUserTypeEditObjectType(
        this.loginType, PrivateStringsForApp.getApartmentEnglishString())
    )
  }

  // This function is called when user type Coordinator is pressing on
  // one of the 'delete tenant from apartment's tenants array' buttons.
  deleteTenantFromApartment(tenant: Tenant, index: number) {
    if (this.absService instanceof CoordinatorService
      // Confirming deleting tenant from apartment's tenants array.
      && confirm(PrivateStringsForApp.confirmDeletingTenantFromApartment_sList(tenant))) {
      this.tenantIndex = index
      // Deleting tenant from apartment's tenants array.
      this.absService.deleteTenantFromApartment(tenant.id)
    }
  }

  // This function is called when user is pressing on one of the tenants name.
  getTenantDetails(tenant: Tenant) {
    // Referring the chosen tenant to the AbsServiceClass tenant field.
    this.absService.tenant = tenant
    // Navigating to the 'tenant-details' component.
    this.absService.getTenantPersonalDetails(tenant)
  }

  // This function is called when user is pressing on the 'back' button.
  back() {
    if (this.absService instanceof GuideService) {
      // User type Guide can enter this component from two different components
      // ('user-start' and 'replacements-table'), checking to which component to navigate.
      if (this.absService.getNavigateToReplacementPage()
      ) {
        this.loginType = PrivateStringsForApp.navigateGuideToReplacementsPage()
        this.absService.donutNavigateToReplacementPage()
        this.absService.showStartPageElementsEmitter.emit(false)
      } else {
        this.absService.showStartPageElementsEmitter?.emit(true)
      }
    } else {
      this.absService.showStartPageElementsEmitter?.emit(true)
    }
    // Navigating to the wanted component.
    this.absService.navigateByUrl(this.loginType)
  }

  // In case user is pressing the back arrow.
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    this.toDisplayApartmentGuidesArray()
    this.absService.showStartPageElementsEmitter?.emit(true)
  }

  // Toggle function for the 'guides' button.
  private toDisplayApartmentGuidesArray(): void {
    if (this.displayApartmentGuidesArray) {
      this.displayApartmentGuidesArray = false
    } else {
      this.displayApartmentGuidesArray = true
    }

  }

}

import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AdminService } from 'src/app/admin/admin.service';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { ApartmentsAndTenantsGender } from 'src/app/common/apartmentsAndTenantsGender';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { ShekelMember } from 'src/app/common/main-objects/shekelMember.modules';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { Tenant } from 'src/app/tenant/tenant.modules';

@Component({
  selector: 'app-tenant-edit',
  templateUrl: './tenant-edit.component.html',
  styleUrls: ['./tenant-edit.component.css']
})

export class TenantEditComponent implements OnInit {
  // For determine tenant's gender (in case of adding a new tenant (Admin type)).
  genderStringArray: string[] = [PrivateStringsForApp.getMaleString(), PrivateStringsForApp.getFemaleString()]

  // For the option element in the 'genderStringArray' select element.
  selectedGender: string = this.genderStringArray[0]
  // For tenant's birth day field.
  birthDayString: string = {} as string
  // For setting fields type string as empty.
  emptyString: string = PrivateStringsForApp.getEmptyString()

  // For tenant's image.
  image: string | ArrayBuffer | null | undefined | SafeUrl = PrivateStringsForApp.getDefaultAssetsString()

  // Initialize an empty object of type Tenant.
  tenant: Tenant = {} as Tenant
  // Initialize an empty object of type File.
  filename: File = {} as File

  // For checking if to update tenant or to create a new tenant.
  editMode: boolean = false

  constructor(
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private userTypeService: GetUserTypeService,
    private adminService: AdminService,
    private elementRef: ElementRef) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking user's type.
    if (this.userTypeService.getUserTypeString() === PrivateStringsForApp.getEnglishAdminString()) {
      // If Admin type:

      // Setting image field as the default option.
      this.setDefaultImage()
      // Referring the tenant's shekelMember field to an empty object.
      this.tenant.shekelMember = {} as ShekelMember
      // Setting phone field as the default option.
      this.tenant.shekelMember.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()
      // For the submit function.
      this.editMode = false
    } else {
      // If Coordinator type:\

      // Referring the tenant field to the AbsServiceClass tenant field.
      this.setEditedTenant(this.tenant, this.absService.tenant)
      // Setting the image field as tenant image byte array field.
      this.image = this.absService.setBlobImage(this.tenant.shekelMember.image, this.absService.getServiceSanitizer())
      // For the submit function.
      this.editMode = true
      // Page color.
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#61FAAF';
    }
  }

  // This function is called when the user is choosing a image, 
  // for setting the chosen image in the image field. 
  setImage(event: any) {
    AbsServiceClass.setImage(event).then(result => {

      this.filename = result

      this.tenant.shekelMember.image = result
    })


    AbsServiceClass.setImageToBlobType(event).then(blobType => {
      this.image = blobType
    })
  }


  onSubmit() {
    //Admin adding new tenant.
    if (!this.editMode) {
      // Setting up new tenants gender.
      if (this.selectedGender === this.genderStringArray[0]) {
        this.tenant.shekelMember.gender = ApartmentsAndTenantsGender.BOYS
      } else {
        this.tenant.shekelMember.gender = ApartmentsAndTenantsGender.GIRLS
      }
      // Checking if date field is not empty
      if (this.birthDayString.length > 0) {
        this.tenant.birthDay = new Date(this.birthDayString)
      } else {
        this.tenant.birthDay = new Date(PrivateStringsForApp.getDefaultFakeBirthDayString())
      }
      this.adminService.createNewTenant(this.tenant, this.filename)
    } else {
      // Coordinator is updating a tenant details
      if (this.absService instanceof CoordinatorService) {
        // Checking if date field is not empty
        if (this.birthDayString.length > 0) {

          this.tenant.birthDay = new Date(this.birthDayString)
        } else if (this.editMode) {
          this.tenant.birthDay = new Date(this.tenant.birthDay.toLocaleString()
            .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getEmptyString())
            .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getHyphen())
            .replace(PrivateStringsForApp.getComma(), PrivateStringsForApp.getHyphen()))
          this.tenant.birthDay.setTime(this.tenant.birthDay.getTime() + (PrivateStringsForApp.getOneDay()))
        }

        this.absService.updateTenantDetails(this.tenant, this.filename)
      }
    }
  }

  // This function is called when user is clearing all of the form input fields.
  onClear() {
    this.tenant.shekelMember.firstName = this.emptyString
    this.tenant.shekelMember.lastName = this.emptyString
    this.tenant.description = this.emptyString
    this.tenant.workPlace = this.emptyString
    this.tenant.shekelMember.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()
    this.selectedGender = this.genderStringArray[0]
    this.image = PrivateStringsForApp.getDefaultAssetsString()
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    // Resetting input fields.
    this.onClear()
    if (this.editMode) {
      // Navigating to 'tenant-details' components.
      this.absService.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(PrivateStringsForApp.getCoordinatorEnglishString()))
    } else {
      // Lighting the first choice in the admin menu in the main page.
      this.adminService.emitFirstPosition()
      // Navigating to the admin main page ('all apartments in the system').
      this.adminService.navigateByUrl(PrivateStringsForApp.getEnglishAdminString())
    }
  }

  // When user keyboard is on the 'phoneNumber' field ,this function is called 
  // for checking if user is typing only number chars.
  omitSpecialChar(event: any) {
    AbsServiceClass.omitSpecialChar(event, this.tenant.shekelMember.phoneNumber, false).then(phoneNumber => {
      this.tenant.shekelMember.phoneNumber = phoneNumber
    })
  }

  // This function is called for setting the image field as the default image option.
  private setDefaultImage() {
    this.adminService.setDefaultImageFile()
    this.adminService.blobEmitter.subscribe(res => {
      this.filename = AbsServiceClass.blobToFile(res, this.filename.name)
    })
  }

  // This function is for setting the tenant fields as the tenant fields form the AbsServiceClass
  // (when updating tenant's details).
  private setEditedTenant(classTenant: Tenant, serviceTenant: Tenant) {
    classTenant.id = serviceTenant.id
    classTenant.shekelMember = serviceTenant.shekelMember
    classTenant.description = serviceTenant.description
    classTenant.workPlace = serviceTenant.workPlace
    classTenant.apartment = serviceTenant.apartment
    classTenant.medicine = serviceTenant.medicine
    classTenant.chores = serviceTenant.chores
    classTenant.birthDay = serviceTenant.birthDay
  }

}

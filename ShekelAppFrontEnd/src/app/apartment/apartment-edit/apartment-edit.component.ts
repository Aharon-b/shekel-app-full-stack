import { Component, Inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AdminService } from 'src/app/admin/admin.service';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { ApartmentsAndTenantsGender } from 'src/app/common/apartmentsAndTenantsGender';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { Apartment } from '../apartment.modules';

@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.css']
})

export class ApartmentEditComponent implements OnInit {
  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // For error message element displaying place.
  private top: number = 0

  // Initialize an empty object of type File for apartment image.
  private filename: File = {} as File
  // Initialize an empty object of type Apartment for adding/updating apartment.
  apartment: Apartment = {} as Apartment
  // Initialize an empty object of type Apartment for saving edited apartment details in case of canceling operation.
  cancelOperApartmentDetails: Apartment = {} as Apartment

  // For image input field.
  image: string | ArrayBuffer | null | undefined | SafeUrl =
    PrivateStringsForApp.getDefaultAssetsString()

  // For apartment image field.
  genderList: ApartmentsAndTenantsGender[] =
    [ApartmentsAndTenantsGender.BOYS, ApartmentsAndTenantsGender.GIRLS]

  // For apartment gender field.
  genderStringList: string[] =
    [PrivateStringsForApp.getBoysString(), PrivateStringsForApp.getGirlsString()]
  selectedGender = this.genderStringList[0]

  // For errors display.
  errorMsg: string = this.emptyString

  // For checking if to update apartment or to create a new apartment.
  editMode: boolean = false

  constructor(
    private adminService: AdminService,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking user type (Admin = new apartment , Coordinator = update apartment from coordinator's array details).
    if (this.userTypeService.getUserTypeString() === PrivateStringsForApp.getEnglishAdminString()) {
      // If user is type Admin:
      // Setting image field as the default option.
      this.setDefaultImage()
      // Setting telephone field as the default option.
      this.apartment.phoneNumber = PrivateStringsForApp.getZeroString()
      // Creating new apartment.
      this.editMode = false
    } else {
      // If user is type Coordinator:
      // Referring the apartment fields to CoordinatorService apartment.
      this.apartment = this.absService.apartment
      // Saving the updated apartment details (for case of canceling operation).
      this.setApartmentDetails(this.cancelOperApartmentDetails, this.apartment)
      // Setting image field as the updated apartment field.
      this.image = this.absService.setBlobImage(this.apartment.image, this.absService.getServiceSanitizer())
      // Updating apartment details.
      this.editMode = true
    }
  }

  // This function is called when user is typing in the telephone number field , for checking that the typed chars are only numbers.
  omitSpecialChar(event: any) {
    AbsServiceClass.omitSpecialChar(event, this.apartment.phoneNumber, true).then(phoneNumber => {
      this.apartment.phoneNumber = phoneNumber
    })
  }

  // This function is called when the user is choosing a image, 
  // for setting the chosen image in the image field. 
  setImage(event: any) {
    AbsServiceClass.setImage(event).then(result => {

      this.filename = result

      this.apartment.image = result
    })

    AbsServiceClass.setImageToBlobType(event).then(blobType => {
      this.image = blobType
    })
  }

  // When user is pressing the submit button.
  onSubmit() {
    // Checking if telephone number field is validated.
    const check = this.apartment.phoneNumber
    if (check.substring(0, 2).match(/^-?\d+$/) && check.substring(3, 10).match(/^-?\d+$/)
      && check[2] == PrivateStringsForApp.getHyphen()
      && check.length == 10) {
      // In case telephone number field is validated, checking if the operation is adding or updating apartment.
      if (!this.editMode) {
        //  In case of adding a new apartment:
        // Setting apartment gender.
        this.setApartmentGender()
        // For the error message element in the html file (if there will be an error in the proses).
        this.top = 50
        // Creating a new apartment in the back-end.
        this.adminService.createNewApartment(this.apartment, this.filename)
        // Setting the apartment name field as empty field.
        this.apartment.name = this.emptyString
        // In case of error.
        this.adminService.msgEmitter.subscribe(errorMsg => {
          // Displaying the error message.
          this.setMsgTime(errorMsg, this.top)
        })
      } else if (this.absService instanceof CoordinatorService) {
        // In case of updating apartment details:
        // Updating the apartment details in the back-end.
        this.absService.updateApartmentDetails(this.apartment, this.filename).then(apartment => {
          // Setting the apartment field in CoordinatorService class.
          this.absService.apartment = apartment
          // Navigating to coordinator start page.
          this.absService.navigateByUrl(
            PrivateStringsForApp.apartmentDisplayUrl(PrivateStringsForApp.getCoordinatorEnglishString()))
          // In case of error.
        }, error => {
          // Setting the apartment name field as empty field.
          this.apartment.name = this.emptyString
          // Displaying the error message.
          this.showErrorMsg(error, 32)

        })
      }
    } else {
      // In case of telephone number field is not validated:

      // Checking if the user is type admin.
      if (!this.editMode) {
        // For the error message element in the html file (if there will be an error in the proses).
        this.top = 200
        // Setting the apartment name field as empty field.
        this.apartment.name = this.emptyString
        // Flashing the error message for five times.
        this.adminService.flashErrorMessage(PrivateStringsForApp.showPhoneInvalidMsg(), 5)
      } else {
        // Displaying the error message.
        this.showErrorMsg(PrivateStringsForApp.showPhoneInvalidMsg(), 195)
      }
    }
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    // Checking the user type.
    if (this.absService instanceof CoordinatorService) {
      // If the user type is Coordinator type:

      // Setting the apartment details as the saved details.
      this.setApartmentDetails(this.apartment, this.cancelOperApartmentDetails)
      // Navigating back to the apartment page.
      AbsServiceClass.doubleNavigate(PrivateStringsForApp.getCoordinatorEnglishString(),
        PrivateStringsForApp.apartmentDisplayUrl(PrivateStringsForApp.getCoordinatorEnglishString())
        , this.absService.getRouter())
    } else {
      // If the user type is Admin type:

      // Lighting the first choice in the admin menu in the main page.
      this.adminService.emitFirstPosition()
      // Navigating to the admin main page ('all apartments in the system').
      this.adminService.navigateByUrl(PrivateStringsForApp.getEnglishAdminString())
    }
  }

  // This function is called when user is clearing all of the form input fields.
  onClear() {
    if (this.editMode) {
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getNameString())).value = this.emptyString;
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getAddressString())).value = this.emptyString;
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getPhoneNumberForId())).value = this.emptyString;

    } else {
      this.apartment.name = this.emptyString
      this.apartment.address = this.emptyString
      this.apartment.phoneNumber = this.emptyString

    }
    this.image = PrivateStringsForApp.getDefaultAssetsString()
    this.setDefaultImage()
  }

  // Help functions:

  // This function is called for flashing error message.
  private showErrorMsg(errorMsg: string, top: number) {
    this.absService.flashErrorMessage(errorMsg, 5)
    this.absService.msgEmitter.subscribe(msg => {
      this.setMsgTime(msg, top)
    })
  }

  // This function is called for displaying error message for a certain amount of time.
  private setMsgTime(msg: string, top: number) {
    setTimeout(() => {
      this.errorMsg = this.emptyString
    }, 1000);
    this.errorMsg = msg
    this.setErrorMsgAttribute(top)
  }

  // This function is called for setting the image field as the default image option.
  private setDefaultImage() {
    this.adminService.setDefaultImageFile()
    this.adminService.blobEmitter.subscribe(res => {
      this.filename = AbsServiceClass.blobToFile(res, this.filename.name)
    })
  }

  // This function is called for setting the error element place.
  private setErrorMsgAttribute(top: number) {
    const errorDiv: HTMLDivElement = (<HTMLDivElement>document.getElementById(PrivateStringsForApp.getErrorString()))
    errorDiv.setAttribute(
      PrivateStringsForApp.getStyleString(),
      PrivateStringsForApp.setApartmentEditErrorMsgAttribute(top))
  }

  // This function is called for setting/saving the updated apartment (in case that the user is Coordinator type).
  private setApartmentDetails(setApartment: Apartment, getApartment: Apartment) {
    setApartment.name = getApartment.name
    setApartment.address = getApartment.address
    setApartment.phoneNumber = getApartment.phoneNumber
    setApartment.image = getApartment.image
  }

  // This function is called for setting the new apartment gender (in case that the user is Admin type).
  private setApartmentGender() {
    if (this.selectedGender === this.genderStringList[0]) {
      this.apartment.gender = ApartmentsAndTenantsGender.BOYS
    } else {
      this.apartment.gender = ApartmentsAndTenantsGender.GIRLS
    }
  }

}

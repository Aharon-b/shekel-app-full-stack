import { Component, Inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AdminService } from 'src/app/admin/admin.service';
import { Coordinator } from 'src/app/coordinator/coordinator.modules';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { GuideService } from 'src/app/guide/guide.service';
import { AbsServiceClass } from '../AbcServiceClass';
import { ApartmentsAndTenantsGender } from '../apartmentsAndTenantsGender';
import { GetUserTypeService } from '../getUserTypeService';
import { ShekelMember } from '../main-objects/shekelMember.modules';
import { PrivateStringsForApp } from '../PrivateStringsForApp';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {
  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // Initialize an empty array of type Coordinator(in case of adding a new WidthGuide user type).
  allCoordinatorsNoWidthGuideArray: Coordinator[] = []
  // Initialize an array of type string for choosing user's gender(in case of adding a new Guide user type).
  genderStringArray: string[] = [
    PrivateStringsForApp.getGuideBoyHebrewString(),
    PrivateStringsForApp.getGuideGirlHebrewString()]
  // Initialize an empty object of type Coordinator.
  selectedCoordinator: Coordinator = {} as Coordinator
  // Initialize an empty object of type ShekelMember.
  shekelMember: ShekelMember = {} as ShekelMember
  // Initialize an empty object of type File.
  filename: File = {} as File

  // For displaying the first option in the 'genderStringList' array field.
  selectedGender: string = this.genderStringArray[0]
  // For the 'username' input field.
  username: string = this.emptyString
  // For displaying default/user's/chosen image.
  image: string | ArrayBuffer | null | undefined | SafeUrl = PrivateStringsForApp.getDefaultAssetsString()
  // For showing error if 'phoneNumber' input field is invalid.
  invalidPhoneNumberMsg: string = this.emptyString

  // For setting the operation kind.
  editMode: boolean = false
  // For checking the type of user admin is adding.

  addingGuide: boolean = false
  addingWidthGuide: boolean = false

  constructor(
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private userTypeService: GetUserTypeService,
    private adminService: AdminService
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking user type.
    if (this.userTypeService.getUserTypeString() === PrivateStringsForApp.getEnglishAdminString()) {
      // If user is Admin type:

      // Adding new user operation.
      this.editMode = false
      // Setting the image field as the default option.
      this.setDefaultImage()
      // Setting the phoneNumber to '05'
      this.shekelMember.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()
      // Getting the type of user to add.
      this.addingGuide = this.adminService.addingGuide
      this.addingWidthGuide = this.adminService.addingWidthGuide

      // If adding a new user of type WidthGuide.
      if (this.addingWidthGuide) {
        // Getting all of the coordinators in the system without a widthGuide.
        this.adminService.getAllCoordinatorsNoWidthGuide()
        this.adminService.coordinatorsEmitter.subscribe(coordinatorsNoWidthGuideArray => {
          // Setting the emitted array to the 'allCoordinatorsNoWidthGuideArray' field.
          this.allCoordinatorsNoWidthGuideArray = coordinatorsNoWidthGuideArray
          // Setting the first object from the emitted array to the 'selectedCoordinator' field. 
          this.selectedCoordinator = this.allCoordinatorsNoWidthGuideArray[0]
        })

      }
    } else if (this.absService) {
      // If user is from type that implements 'AbsServiceClass':

      // Getting the user's details.
      this.shekelMember = this.absService.shekelMember
      this.username = this.absService.getLoggedInUsername()
      // Editing user details operation.
      this.editMode = true
      if (this.absService instanceof CoordinatorService || this.absService instanceof GuideService) {
        // Setting user image in the image element.
        this.absService.getUserImage().then(userImage => {
          this.shekelMember.image = userImage
          this.image = this.absService.setBlobImage(userImage, this.absService.getServiceSanitizer())
        })
      } else {
        this.addingWidthGuide = true
      }
    }
  }

  // This function is called when the user is choosing a image, for setting the chosen image in the image field. 
  setImage(event: any) {
    AbsServiceClass.setImage(event).then(result => {

      this.filename = result

      this.shekelMember.image = result
    })

    AbsServiceClass.setImageToBlobType(event).then(blobType => {
      this.image = blobType
    })
  }

  // This function is called when user is typing in the phone number field , for checking that the typed chars are only numbers.
  omitSpecialChar(event: any) {
    AbsServiceClass.omitSpecialChar(event, this.shekelMember.phoneNumber, false).then(phoneNumber => {
      this.shekelMember.phoneNumber = phoneNumber
    })
  }

  // When user is pressing the submit button.
  onSubmit() {
    // Checking if telephone number field is validated.
    const check = this.shekelMember.phoneNumber
    if (check.substring(0, 3).match(/^-?\d+$/) && check.substring(4, 11).match(/^-?\d+$/) && check[3] == "-" && check.length == 11) {
      // In case phone number field is validated, checking if the operation is adding or updating user details.
      if (!this.editMode) {
        // If the operation is adding user operation:

        // Checking witch type of user to aad:

        if (this.addingWidthGuide) {
          // If adding new WidthGuide type:

          // Resetting the 'addingWidthGuide' field in the service.
          this.adminService.addingWidthGuide = false
          // Calling function to add new WidthGuide from the service.
          this.adminService.addNewWidthGuide(this.shekelMember, this.username, this.selectedCoordinator.id).then(() => {
            // Showing the start page menu.
            this.adminService.showOptionsBooleanEmitter.emit(true)
            // Navigating to 'all-width-guides' component.
            this.adminService.navigateByUrl(PrivateStringsForApp.getAllFromObjectType(PrivateStringsForApp.getEnglishAdminString(), PrivateStringsForApp.getWidthGuideEnglishPluralString()))
          })
        } else if (this.addingGuide) {
          // If adding new Guide type:

          // Setting guide's gender (can't be a male guide in girls apartment).
          if (this.selectedGender === this.genderStringArray[0]) {
            this.shekelMember.gender = ApartmentsAndTenantsGender.BOYS
          } else {
            this.shekelMember.gender = ApartmentsAndTenantsGender.GIRLS
          }
          // Calling function to add new Guide from the service.
          this.adminService.createNewGuide(this.shekelMember, this.username, this.filename)

        } else {
          // If adding new Coordinator type:

          // Calling function to add new Coordinator from the service.
          this.adminService.createNewCoordinator(this.shekelMember, this.username, this.filename)
        }
      } else {
        // If user is from type that implements 'AbsServiceClass':

        // Calling function to update user details from AbsServiceClass.
        this.absService.updateUserDetails(this.shekelMember, this.username, this.filename)
      }
    } else {
      // If phoneNumber field is invalid:

      // Checking user type and showing error on the screen.
      if (!this.editMode) {
        this.setMsgTime(PrivateStringsForApp.showPhoneInvalidMsg())
      } else {
        this.showErrorMsg(PrivateStringsForApp.showPhoneInvalidMsg())
      }
    }
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    // Checking user type.
    if (!this.editMode) {
      // If Admin type:

      // Lighting the first option an the admin start page menu.
      this.adminService.positionEmitter.emit(PrivateStringsForApp.getAdmin_1_MenuSpot())
      // Showing the menu.
      this.adminService.showOptionsBooleanEmitter.emit(true)
      // Navigating to 'all-apartments' component.
      this.adminService.navigateByUrl(PrivateStringsForApp.getAllFromObjectType(
        PrivateStringsForApp.getEnglishAdminString(),
        PrivateStringsForApp.getApartmentEnglishPluralString()))
    } else {
      // If user is from type that implements 'AbsServiceClass':

      // Showing the start page buttons.
      this.absService.showStartPageElementsEmitter.emit(true)
      // Navigating to user's start page.
      this.absService.navigateByUrl(this.userTypeService.getUserTypeString())
    }
  }

  onClear() {
    // Checking user type and resetting the relevant fields.
    if (this.editMode) {
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getFirstNameForId())).value = this.emptyString;
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getLastNameForId())).value = this.emptyString;
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getUserNameForId())).value = this.emptyString;
      (<HTMLInputElement>document.getElementById(PrivateStringsForApp.getPhoneNumberForId())).value = PrivateStringsForApp.getDefaultPhoneNumber()

    } else {
      this.shekelMember.firstName = this.emptyString
      this.shekelMember.lastName = this.emptyString
      this.shekelMember.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()

    }
    this.image = PrivateStringsForApp.getDefaultAssetsString()
    this.setDefaultImage()
  }

  // help functions:

  private setDefaultImage() {
    this.adminService.setDefaultImageFile()
    this.adminService.blobEmitter.subscribe(res => {
      this.filename = AbsServiceClass.blobToFile(res, this.filename.name)
    })
  }

  private showErrorMsg(msg: string) {
    this.absService.flashErrorMessage(msg, 5)
    this.absService.msgEmitter.subscribe(msg => {
      this.setMsgTime(msg)
    })
  }

  private setMsgTime(msg: string) {
    setTimeout(() => { this.invalidPhoneNumberMsg = this.emptyString }, 1000);
    this.shekelMember.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()
    this.invalidPhoneNumberMsg = msg
  }

}



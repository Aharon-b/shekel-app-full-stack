import { Component, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { ApartmentsAndTenantsGender } from 'src/app/common/apartmentsAndTenantsGender';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Guide } from 'src/app/guide/guide.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-guides-no-apartments-display',
  templateUrl: './all-guides-no-apartments-display.component.html',
  styleUrls: ['./all-guides-no-apartments-display.component.css']
})

export class AllGuidesNoApartmentsDisplayComponent implements OnInit {
  // Initialize empty object of type Guide[] for all guides in the system without apartment.
  guidesWithNoApartmentsArray: Guide[] = []
  // Initialize empty object of type Guide for the chosen guide's name & id.
  guide: Guide = {} as Guide
  // Initialize empty object of type Apartment[] for all apartments in the system.
  apartmentsInSystem: Apartment[] = []
  // Initialize empty object of type Apartment for the chosen apartment.
  selectedApartment: Apartment = {} as Apartment
  // Initialize boolean object for enable/disable the submit button. 
  showSendButton: boolean = false
  // Initialize string object for the chosen guide input field as the default option('to choose guide press on guides name').
  guideName: string = PrivateStringsForApp.getDefaultGuideName()
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all guides in the system with no apartments.
    this.adminService.getAllGuidesWithNoApartments()
    // Subscribing to guides array emitter.
    this.adminService.guidesEmitter.subscribe(allGuidesNoApartmentArray => {
      // Referring the array that was emitted to 'guidesWithNoApartmentsList' array field.
      this.guidesWithNoApartmentsArray = allGuidesNoApartmentArray
    })
  }

  // This function is called when user pressed on one of the guide's name.
  chooseGuide(guide: Guide) {
    // Referring the chosen guide to class guide in case user wants so send the pressed guide.
    this.guide = guide
    // Getting All The apartments in the system. 
    this.adminService.getAllApartments()
    // Subscribing to apartments array emitter.
    const subscription = this.adminService.apartmentsEmitter.subscribe(apartmentsArray => {
      // Because a boy guide can't by be a guide in a girls apartment,
      // etch time user clicks on one of the guides names,
      // the function is checking if the chosen guide is a boy gender.
      if (guide.shekelMember.gender == ApartmentsAndTenantsGender[ApartmentsAndTenantsGender.BOYS]) {
        // If so, the function is going over the emitted list
        // to check apartment's gender.
        apartmentsArray.forEach(apartment => {
          // If the apartment gender is different then guide's gender(apartment.gender === ApartmentsAndTenantsGender.GIRLS).
          if (apartment.gender !== guide.shekelMember.gender) {
            // Getting the apartment index on the array.
            var index = apartmentsArray.indexOf(apartment)
            if (index > -1) {
              // deleting the apartment from the emitted array. 
              apartmentsArray.splice(index, 1);
            }
          }
        })
      }
      // Referring the chosen guide name to 'guideName' field.
      this.guideName = guide.shekelMember.firstName + " " + guide.shekelMember.lastName
      // Referring the first apartment from the array that was emitted to 'selectedApartment' field.
      this.selectedApartment = apartmentsArray[0]
      // Referring the array that was emitted to 'apartmentsInSystem' array field.
      this.apartmentsInSystem = apartmentsArray
      // Enabling the submit button. 
      this.showSendButton = true
      // Unsubscribing from the 'apartmentsEmitter'.
      subscription.unsubscribe()
    })
  }

  // This function is called when user presses the 'add apartment to guide' button. 
  addApartmentToGuide() {
    // Confirming the operation.
    if (confirm(PrivateStringsForApp.confirmAddingGuideToApartment(this.guideName, this.selectedApartment.name))) {
      // Calling a function for adding guide to apartment.
      this.adminService.addApartmentToGuide_sArray(this.guide, this.selectedApartment)
      // Subscribing to adminService message emitter.
      this.adminService.msgEmitter.subscribe(msg => {
        // Showing success message for a second and a half.
        setTimeout(() => {
          this.msg = PrivateStringsForApp.getEmptyString()
          // navigating to 'apartment-list' component.
          this.adminService.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_3_MenuSpot(), PrivateStringsForApp.getAllFromObjectType(PrivateStringsForApp.getEnglishAdminString(), PrivateStringsForApp.getGuideEnglishPluralString()))
        }, 1500);
        this.msg = msg
      })
    }
  }

}

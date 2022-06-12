import { Component, Inject, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { Apartment } from '../../apartment.modules';

@Component({
  selector: 'app-user-apartment-display',
  templateUrl: './user-apartment-display.component.html',
  styleUrls: ['./user-apartment-display.component.css']
})

export class UserApartmentDisplayComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // (property binding from user apartment-list component).
  // Initialize an empty object of type Apartment.
  @Input() apartment: Apartment = {} as Apartment
  // Initialize an empty object of type Subscription.
  subscription: Subscription = {} as Subscription
  // Initialize an empty object for apartment image display.
  image: SafeUrl = {}
  // For deleting apartment message.
  msgString: string = this.emptyString
  // For showing/hiding 'delete apartment from coordinator's apartments array' button.
  userType: string = this.emptyString

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.userType = this.userTypeService.getUserTypeString()
  }

  ngOnInit(): void {
    // Getting the apartment image byte array from the back-end.
    this.absService.getApartmentImage(this.apartment.id).then(imageByteArray => {
      // Referring the given byte array to the apartment image field.
      this.apartment.image = imageByteArray
      // Setting the image field as the apartment image.
      this.image = this.absService.setBlobImage(imageByteArray, this.absService.getServiceSanitizer())
    })
  }

  // This function is called when user is pressing on one of the apartments image.
  apartmentDisplay(apartment: Apartment) {
    // Hiding the buttons from the start component.
    this.absService.showStartPageElementsEmitter?.emit(false)
    // Calling a function from the service for referring the chosen apartment to the 'tenants-list' component,
    // and navigating to the component. 
    this.absService.apartmentDisplay(apartment)
  }

  // This function is called when user is pressing on one of the apartments delete button.
  deleteApartmentFromCoordinatorList() {
    // Checking if the user is Coordinator type and confirming the operation. 
    if (confirm(PrivateStringsForApp.confirmDeletingApartmentFromCoordinator_sArray(this.apartment.name))
      && this.absService instanceof CoordinatorService) {
      // Calling the delete function from the service and passing deleted apartment.
      this.absService.deleteApartmentFromCoordinatorArray(this.apartment)
      // Referring the subscription field to the AbsService message emitter.
      this.subscription = this.absService.msgEmitter.subscribe(msg => {
        // Referring the emitted msg to the msgString field.
        this.msgString = msg
        setTimeout(() => {
          if (this.absService instanceof CoordinatorService) {
            // Setting the msgString field to be empty.
            this.msgString = this.emptyString
            // Navigating to user start page.
            this.absService.doubleNavigateWithTimeOut(PrivateStringsForApp.navigateToChangePassword
              (PrivateStringsForApp.getCoordinatorEnglishString()),
              PrivateStringsForApp.getCoordinatorEnglishString(), 10)
          }
        }, 2000);
        // Stopping the subscription proses.
        this.subscription.unsubscribe();
      })
    }
  }

}

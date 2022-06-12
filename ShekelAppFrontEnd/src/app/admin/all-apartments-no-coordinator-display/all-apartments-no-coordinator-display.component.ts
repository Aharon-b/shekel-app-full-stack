import { Component, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Coordinator } from 'src/app/coordinator/coordinator.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-apartments-no-coordinator-display',
  templateUrl: './all-apartments-no-coordinator-display.component.html',
  styleUrls: ['./all-apartments-no-coordinator-display.component.css']
})

export class AllApartmentsNoCoordinatorDisplayComponent implements OnInit {
  // Initialize empty object of type Apartment[] for all apartments in the system without coordinator.
  apartmentsNoCoordinatorArray: Apartment[] = []
  // Initialize empty object of type Apartment for the chosen apartment.
  chosenApartment: Apartment = {} as Apartment
  // Initialize empty object of type Coordinator[] for all coordinators in the system.
  coordinatorsInSystem: Coordinator[] = []
  // Initialize empty object of type Coordinator for the chosen coordinator.
  selectedCoordinator: Coordinator = {} as Coordinator
  // Initialize boolean object for hiding/showing the div with the 'add apartment to coordinator' option .
  showAddCoordinatorToApartmentDiv: boolean = false
  // Initialize boolean object for enable/disable the submit button. 
  showSubmitBtn: boolean = false
  // Initialize string object for the chosen apartment input field as the default option('to choose apartment press on apartment name').
  apartmentName: string = PrivateStringsForApp.getDefaultApartmentName()
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all apartments in the system with no coordinator.
    this.adminService.getAllApartmentsWithNoCoordinator()
    // Subscribing to apartments array emitter.
    this.adminService.apartmentsEmitter.subscribe(allApartmentsWithNoCoordinatorArray => {
      // Referring the array that was emitted to 'allApartmentsWithNoCoordinatorArray' array field.
      this.apartmentsNoCoordinatorArray = allApartmentsWithNoCoordinatorArray
    })
    // Getting all coordinators in the system.
    this.adminService.getAllCoordinators()
    // Subscribing to coordinator array emitter.
    this.adminService.coordinatorsEmitter.subscribe(allCoordinatorsArray => {
      // Referring the first coordinator in the array that wat emitted to 'selectedCoordinator' object.
      this.selectedCoordinator = allCoordinatorsArray[0]
      // Referring the array that wat emitted to 'coordinatorsInSystem' array field.
      this.coordinatorsInSystem = allCoordinatorsArray
      // Showing the 'add apartment to coordinator' div.
      this.showAddCoordinatorToApartmentDiv = true
    })
  }

  // This function is called when user pressed on one of the apartment's name.
  chooseApartment(apartment: Apartment): void {
    // Enabling the submit button. 
    this.showSubmitBtn = true
    // Referring the chosenApartment field to the clicked apartment.
    this.chosenApartment = apartment
    // Referring the apartmentName field to chosen apartment name.
    this.apartmentName = apartment.name
  }

  // This function is called when user presses the 'add apartment to coordinator' button.  
  addCoordinatorToApartment(): void {
    // Calling a function for adding apartment to coordinator.
    this.adminService.addApartmentToCoordinator_sArray(this.chosenApartment, this.selectedCoordinator)
    // Subscribing to adminService message emitter.
    this.adminService.msgEmitter.subscribe(msg => {
      // Showing success message for a second and a half.
      setTimeout(() => {
        this.msg = PrivateStringsForApp.getEmptyString()
        // navigating to 'apartments-list' component.
        this.adminService.navigateToNewObjectPageList(PrivateStringsForApp.getAdmin_1_MenuSpot(),
          PrivateStringsForApp.getEnglishAdminString())
      }, 1500);
      this.msg = msg
    })
  }

}

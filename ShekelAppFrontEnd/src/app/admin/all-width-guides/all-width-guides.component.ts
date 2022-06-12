import { Component, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Coordinator } from 'src/app/coordinator/coordinator.modules';
import { Guide } from 'src/app/guide/guide.modules';
import { WidthGuide } from 'src/app/width-guide/width-guide-modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-width-guides',
  templateUrl: './all-width-guides.component.html',
  styleUrls: ['./all-width-guides.component.css']
})

export class AllWidthGuidesComponent implements OnInit {
  // Initialize empty object of type WidthGuide[] for all width-guides in the system.
  widthGuidesArray: WidthGuide[] = []
  // Initialize empty object of type Coordinator[] for all coordinators with no width-guide in the system.
  // (In case user wants to add guide as width-guide).
  coordinatorsArray: Coordinator[] = []
  // For the selected coordinator for attaching with the guide as a new width-guide.
  // (In case user wants to add guide as width-guide).
  selectedCoordinator: Coordinator = {} as Coordinator
  // Initialize empty object of type Guide[] for all guides with no 'width-guide' role in the system.
  // (In case user wants to add guide as width-guide).
  guidesList: Guide[] = []
  // For the selected guide.
  // (In case user wants to add guide as width-guide).
  selectedGuide: Guide = {} as Guide
  // For enabling/disenabling the 'Add width-guide' button.
  showAddingOptions: boolean = false
  // For opening/closing the 'Adding width-guide options' menu.
  selectGuide: boolean = false
  // The default phone number field.
  phoneNumber: string = PrivateStringsForApp.getDefaultPhoneNumber()
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all width-guides in the system.
    this.adminService.getAllWidthGuides()
    // Subscribing to width-guides array emitter.
    this.adminService.widthGuidesEmitter.subscribe(widthGuidesArray => {
      // Getting width-guide's coordinator.
      widthGuidesArray.forEach(widthGuide => {
        // referring etch width-guide to his coordinator.
        this.adminService.getWidthGuideCoordinator(widthGuide)
      })
      // Referring the array that was emitted to 'widthGuidesList' array field.
      this.widthGuidesArray = widthGuidesArray
    })
  }

  // This function is called when pressing the 
  // delete button on one of the width-guide's in the system.
  deleteWidthGuideFromSystem(widthGuide: WidthGuide): void {
    // Calling the delete function from the service and passing width-guide.
    this.adminService.deleteWidthGuideFromSystem(widthGuide).then(msg => {
      // After width-guide is deleted from the system, 
      // displaying success message on the screen for one second.
      setTimeout(() => {
        // Getting the index of the deleted width-guide in the html table.
        const index = this.widthGuidesArray.indexOf(widthGuide)
        if (index > -1) {
          // Removing the deleted width-guide from the html table.
          this.widthGuidesArray.splice(index, 1);
        }
        this.msg = PrivateStringsForApp.getEmptyString()
      }, 1000);
      this.msg = msg
    })
  }

  // When user presses the 'Add width-guide' button.
  newWidthGuide(): void {
    // Showing the 'Adding width-guide options' menu.
    this.showAddingOptions = true
  }

  // After 'Adding width-guide options' is opened, if the 'Guide as width-guide' button is pressed
  // this function is called. 
  guideAsWidthGuide(): void {
    // Getting all guides in the system that are not width-guides.
    this.adminService.allGuidesThatAreNotWidthGuides()
    // Subscribing to guides array emitter.
    this.adminService.guidesEmitter.subscribe(allGuidesThatAreNotWidthGuides => {
      // Referring the first guide from the array that was emitted to 'selectedGuide' field.
      this.selectedGuide = allGuidesThatAreNotWidthGuides[0]
      // Referring the array that was emitted to 'guidesList' array field.
      this.guidesList = allGuidesThatAreNotWidthGuides

    })
    // Getting all coordinators in the system with no width-guide.
    this.adminService.getAllCoordinatorsNoWidthGuide()
    // Subscribing to coordinators array emitter.
    this.adminService.coordinatorsEmitter.subscribe(allCoordinatorsNoWidthGuideArray => {
      // Referring the first coordinator from the array that was emitted to 'selectedCoordinator' field.
      this.selectedCoordinator = allCoordinatorsNoWidthGuideArray[0]
      // Referring the array that was emitted to 'coordinatorsList' array field.
      this.coordinatorsArray = allCoordinatorsNoWidthGuideArray
    })
    // Opening the 'Guides and coordinators' menu.
    this.selectGuide = true
  }

  // After 'Adding width-guide options' is opened, if the 'Add new width-guide' button is pressed
  // this function is called. 
  addNewWidthGuide(): void {
    // Setting the 'addingGuide' field in the adminService for the 'user-edit' component.
    this.adminService.addingGuide = false
    // Setting the 'addingWidthGuide' field in the adminService for the 'user-edit' component.
    this.adminService.addingWidthGuide = true
    // Closing the main menu in the 'admin-start' component.
    this.adminService.showOptionsBooleanEmitter.emit(false)
    // Navigating to the 'user-edit' component.
    this.adminService.navigateByUrl(
      PrivateStringsForApp.navigateToUserTypeEditObjectType(
        PrivateStringsForApp.getEnglishAdminString(), PrivateStringsForApp.getWidthGuideEnglishString()))
  }

  // After 'Adding width-guide options' is opened, if the 'Guide as width-guide' button is pressed,
  // and user selected guide & coordinator and pressed the 'Submit' button this function is called. 
  addGuideAsWidthGuide(): void {
    // Sending the details to the back-end.
    this.adminService.addGuideAsWidthGuide(this.selectedCoordinator.id, this.selectedGuide, this.phoneNumber).then(widthGuide => {
      // After the operation is done, adding the new width-guide to the html table.
      this.widthGuidesArray.push(widthGuide)
      // Resetting the 'phoneNumber' field,
      this.phoneNumber = PrivateStringsForApp.getDefaultPhoneNumber()
      // Closing the 'Guides and coordinators' menu.
      this.cancelGuideAsWidthGuide()
      // Closing 'Adding width-guide options' menu.
      this.cancel()
    })
  }

  // When user keyboard is on the 'phoneNumber' field ,this function is called 
  // for checking if user is typing only number chars.
  omitSpecialChar(event: any): void {
    AbsServiceClass.omitSpecialChar(event, this.phoneNumber, false).then(phoneNumber => {
      this.phoneNumber = phoneNumber
    })
  }

  //This function is called when closing 'Adding width-guide options' menu.
  cancel(): void {
    this.showAddingOptions = false
  }

  //This function is called when closing the 'Guides and coordinators' menu.
  cancelGuideAsWidthGuide(): void {
    this.selectGuide = false
    this.showAddingOptions = true
  }

}




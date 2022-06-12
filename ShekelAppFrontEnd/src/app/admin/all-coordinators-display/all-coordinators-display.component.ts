import { Component, OnInit } from '@angular/core';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Coordinator } from 'src/app/coordinator/coordinator.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-coordinators-display',
  templateUrl: './all-coordinators-display.component.html',
  styleUrls: ['./all-coordinators-display.component.css']
})

export class AllCoordinatorsDisplayComponent implements OnInit {
  // Initialize empty object of type Coordinator[] for all coordinators in the system.
  coordinatorsArray: Coordinator[] = []
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all coordinators in the system.
    this.adminService.getAllCoordinators()
    // Subscribing to coordinators array emitter.
    this.adminService.coordinatorsEmitter.subscribe(allCoordinatorsArray => {
      // Getting each coordinator apartments.
      allCoordinatorsArray.forEach(coordinator => {
        // Referring coordinator to his apartments.
        this.adminService.getCoordinatorApartments(coordinator)
      })
      // Referring the array that was emitted to 'allCoordinatorsArray' array field.
      this.coordinatorsArray = allCoordinatorsArray
    })
  }

  // This function is called when user type admin pressed the 
  // delete button on one of the coordinators in the system.
  deleteCoordinatorFromSystem(coordinator: Coordinator): void {
    // Calling the delete function from the service and passing coordinator id.
    this.adminService.deleteCoordinatorFromSystem(coordinator.id).then(msg => {
      // After coordinator is deleted from the system, 
      // displaying success message on the screen for one second.
      setTimeout(() => {
        this.msg = PrivateStringsForApp.getEmptyString()
      }, 1000);
      this.msg = msg
      // Getting the index of the deleted coordinator in the html table.
      const index = this.coordinatorsArray.indexOf(coordinator)
      if (index > -1) {
        // Removing the deleted coordinator from the html table.
        this.coordinatorsArray.splice(index, 1);
      }
    })
  }

}

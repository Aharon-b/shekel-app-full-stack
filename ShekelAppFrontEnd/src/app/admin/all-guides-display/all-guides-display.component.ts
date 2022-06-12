import { Component, OnInit } from '@angular/core';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Guide } from 'src/app/guide/guide.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-guides-display',
  templateUrl: './all-guides-display.component.html',
  styleUrls: ['./all-guides-display.component.css']
})

export class AllGuidesDisplayComponent implements OnInit {
  // Initialize empty object of type Guide[] for all guides in the system.
  guidesArray: Guide[] = []
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all guides in the system.
    this.adminService.getAllGuides()
    // Subscribing to guides array emitter.
    this.adminService.guidesEmitter.subscribe(guidesArray => {
      // Getting each guide apartments.
      guidesArray.forEach(guide => {
        // Getting guide apartments.
        this.adminService.getGuideApartments(guide)
      })
      // Referring the array that was emitted to 'guidesList' array field.
      this.guidesArray = guidesArray
    })
  }

  // This function is called when user type admin pressed the 
  // delete button on one of the guides in the system.
  deleteGuideFromSystem(guide: Guide): void {
    // Calling the delete function from the service and passing guide.
    this.adminService.deleteGuideFromSystem(guide)
    // Removing the deleted guide from the html table with deleted guide index.
    this.guidesArray.splice(this.guidesArray.indexOf(guide), 1)
    // Subscribing to msg emitter.
    this.adminService.msgEmitter.subscribe(msg => {
      // After guide is deleted from the system, 
      // displaying success message on the screen for one second.
      setTimeout(() => {
        this.msg = PrivateStringsForApp.getEmptyString()
      }, 1000);
      this.msg = msg
    })
  }

}

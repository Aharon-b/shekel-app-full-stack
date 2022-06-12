import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Apartment } from '../../apartment.modules';

@Component({
  selector: 'app-admin-apartment-display',
  templateUrl: './admin-apartment-display.component.html',
  styleUrls: ['./admin-apartment-display.component.css']
})

export class AdminApartmentDisplayComponent implements OnInit {
  // (property  binding from user start page component).
  // Initialize an empty object of type Apartment.
  @Input() apartments: Apartment[] = []
  // For deleting apartment message.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void { }

  // When the user deletes apartment from the system.
  deleteApartmentFromSystem(apartment: Apartment) {
    // Lighting the first choice in the admin menu in the main page.
    this.adminService.emitFirstPosition()
    // Calling the delete function from the service and passing the apartment to delete.
    this.adminService.deleteApartmentFromSystem(apartment)
    // Subscribing to the msg emitter on service.
    this.adminService.msgEmitter.subscribe(msg => {
      // Removing the deleted apartment from the 'all apartments' table.
      this.apartments.splice(this.apartments.indexOf(apartment), 1)
      // Showing the success deleting apartment message.
      this.showMsg(msg)
    })
  }

  // This function is called for displaying message.
  private showMsg(msg: string) {
    setTimeout(() => {
      this.msg = PrivateStringsForApp.getEmptyString()
    }, 1500);
    this.msg = msg
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Apartment } from '../apartment.modules';

@Component({
  selector: 'app-apartments-list',
  templateUrl: './apartments-list.component.html',
  styleUrls: ['./apartments-list.component.css']
})

export class ApartmentsListComponent implements OnInit {
  // Initialize an empty array of type Apartment.
  apartmentsList: Apartment[] = []
  // For checking witch component to show the user.
  clientType: string = PrivateStringsForApp.getEmptyString()

  constructor(
    private adminService: AdminService,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.clientType = this.userTypeService.getUserTypeString()
  }

  ngOnInit(): void {
    // Checking the user type.
    if (this.clientType === PrivateStringsForApp.getEnglishAdminString()) {
      // If the user is Admin type:

      // Getting all of the apartments in the system.
      this.adminService.getAllApartments()
      // Subscribing to the apartments emitter on AdminService.
      this.adminService.apartmentsEmitter.subscribe(apartmentsList => {
        // Referring the apartments list from the back-end to this apartments array.
        this.apartmentsList = apartmentsList
      })
    } else {
      // If the user is implementing from AbsServiceClass:

      // Getting user's apartments from the back-end.
      this.absService.getUserApartments()
      // Subscribing to the apartments emitter on AbsServiceClass.
      this.absService.apartmentsEmitter.subscribe(apartmentsList => {
        // Referring the apartments list from the back-end to this apartments array.
        this.apartmentsList = apartmentsList
      })
    }
  }

}

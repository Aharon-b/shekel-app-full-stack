import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { Coordinator } from '../coordinator.modules';
import { CoordinatorService } from '../coordinator.service';

@Component({
  selector: 'app-coordinator-start',
  templateUrl: './coordinator-start.component.html',
  styleUrls: ['./coordinator-start.component.css'],
})

export class CoordinatorStartComponent implements OnInit {
  // Initialize an empty array of type Tenant.
  coordinatorTenants: Tenant[] = []
  // Initialize an empty array of type JSON.
  coordinatorApprovalArray: JSON[] = []

  // Initialize an empty object of type Coordinator.
  coordinator: Coordinator = {} as Coordinator

  // For checking witch component to display.
  passwordUpdatedBoolean: boolean = false
  // For checking if to display user details.
  detailsDisplay: boolean = false
  // For checking if to show 'add-replacement-request' component.
  toAddRequest: boolean = false

  constructor(
    private elementRef: ElementRef,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#66CDAA';
  }

  ngOnInit(): void {
    if (this.absService instanceof CoordinatorService) {
      // Checking if password is updated.
      this.passwordUpdatedBoolean = this.absService.isPasswordUpdated()
      // Displaying 'user-start' component.
      this.detailsDisplay = true
      // Getting user's details.
      this.absService.getUserDetails()
      this.absService.userEmitter.subscribe((coordinator: Coordinator) => {
        // Referring the emitted Coordinator object to the coordinator field.
        this.coordinator = coordinator
      })

      // Getting all coordinator's replacement requests to approve.
      this.absService.getCoordinatorApprovalArray().then(coordinatorApprovalArray => {
        // Referring the given array to the 'coordinatorApprovalArray' field.
        this.coordinatorApprovalArray = coordinatorApprovalArray
      })
    } else {
      // If the 'AbsServiceClass' field iss undefined.
      AbsServiceClass.logout()
    }

    // Subscribing to the 'showReplacementRequestEmitter' boolean emitter 
    // for showing/hiding 'add-replacement-request-or-offer' component.
    this.absService.showReplacementRequestEmitter.subscribe(toShow => {
      this.toAddRequest = toShow
    })

    // Subscribing to the 'showStartPageButtonsEmitter' boolean emitter 
    // for showing/hiding 'user-start' component.
    this.absService.showStartPageElementsEmitter?.subscribe(display => {
      this.detailsDisplay = display
    })

    // Subscribing to the 'passwordUpdateEmitter' boolean emitter 
    // for showing/hiding 'change-password' component 
    // (if user wants to update password).
    this.absService.passwordUpdateEmitter.subscribe(passwordUpdated => {
      this.passwordUpdatedBoolean = passwordUpdated
    })

    // Getting all coordinator's tenants.
    this.absService.getUserTenants().then(coordinatorTenants => {
      // Referring the given array to the 'coordinatorTenants' field.
      this.coordinatorTenants = coordinatorTenants
    })
  }

}

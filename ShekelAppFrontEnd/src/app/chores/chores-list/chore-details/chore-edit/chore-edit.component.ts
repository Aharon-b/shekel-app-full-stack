import { Component, Inject, OnInit } from '@angular/core';
import { Chore } from 'src/app/chores/chores.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';

@Component({
  selector: 'app-chore-edit',
  templateUrl: './chore-edit.component.html',
  styleUrls: ['./chore-edit.component.css']
})

export class ChoreEditComponent implements OnInit {
  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()

  // Setting a string array field for the days in week select element.
  daysOfWeekStringArray: string[] = PrivateStringsForApp.getWeekInHebrewStringArray()
  // Setting the first day from the array for the option element. 
  selectedDay: string = this.daysOfWeekStringArray[0]

  // Initialize an empty object of type Chore.
  chore: Chore = {} as Chore

  // For checking kind of operation.
  editMode: boolean = false

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private coordinatorService: CoordinatorService
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking kind of operation.
    if (this.absService.chore.id > 0) {
      // If edit operation:

      // Setting the chore field details from the AbsServiceClass.
      this.chore = this.absService.chore
      // Setting the selectedDay field as the chore day field.
      this.selectedDay = this.chore.day
      // Setting the editMode field for the submission operation.
      this.editMode = true
    } else {
      // If add new chore operation:

      // Resetting the chore field details.
      this.chore.day = this.emptyString
      this.chore.name = this.emptyString
      this.chore.description = this.emptyString
      // Setting the editMode field for the submission operation.
      this.editMode = false
    }
  }

  // When user is pressing the submit button.
  onSubmit() {
    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService) {
      // Setting the chore day field as the chosen day option.
      this.chore.day = this.selectedDay
      if (!this.editMode) {
        // If adding chore operation:
        // Calling the function for creating a new chore in the back-end.
        this.absService.createNewChore(this.chore)
      } else {
        // If edit chore details operation:
        // Calling the function for updating chore details in the back-end.
        this.absService.updateChoreDetails(this.chore)
      }
    }
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    // Resetting the chore field details.
    this.onClear()
    // Navigating to user's start page.
    this.coordinatorService.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.userTypeService.getUserTypeString()))
  }

  // This function is called when user is clearing all of the fields.
  onClear() {
    // Resetting the chore field details.
    this.chore.description = this.emptyString
    this.chore.name = this.emptyString
    this.selectedDay = this.daysOfWeekStringArray[0]
  }

}

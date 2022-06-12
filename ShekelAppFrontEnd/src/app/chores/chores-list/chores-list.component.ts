import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Chore } from '../chores.modules';

@Component({
  selector: 'app-chores-list',
  templateUrl: './chores-list.component.html',
  styleUrls: ['./chores-list.component.css']
})

export class ChoresListComponent implements OnInit {
  // (property  binding from tenant chores-array).
  // Initialize an empty array of type Chore.
  @Input() choresArray = [] as Chore[]
  // For checking if user can add a chore to tenant chores-array.
  loginType: string = {} as string

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.loginType = this.userTypeService.getUserTypeString()
  }

  ngOnInit(): void { }

  // This function is called when user is pressing on the 'add-chore' button.
  newChore() {
    // Resetting the id of the chore field in the AbsServiceClass.
    this.absService.chore.id = 0
    // Navigating to 'chore-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToUserTypeEditObjectType
      (this.userTypeService.getUserTypeString(),
        PrivateStringsForApp.getChoreString()))
  }

}

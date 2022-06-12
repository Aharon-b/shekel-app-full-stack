import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { Chore } from '../../chores.modules';

@Component({
  selector: 'app-chore-details',
  templateUrl: './chore-details.component.html',
  styleUrls: ['./chore-details.component.css']
})

export class ChoreDetailsComponent implements OnInit {
  // (property  binding from tenant 'chore-list' component).
  // Initialize an empty object of type Chore.
  @Input() chore: Chore = {} as Chore
  // For checking if user can update/delete chore details from the system.
  loginType: string = {} as string

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.loginType = this.userTypeService.getUserTypeString()
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void { }

  // This function is called when user is pressing on the 'update-chore-details' button.
  updateChoreDetails() {
    // Setting the chore field in the AbsServiceClass.
    this.absService.chore = this.chore
    // Navigating to 'chore-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToUserTypeEditObjectType
      (this.userTypeService.getUserTypeString(),
        PrivateStringsForApp.getChoreString()))
  }

  // This function is called when user is pressing on the 'delete-chore' button.
  deleteChoreFromSystem() {
    if (this.absService instanceof WidthGuideService || this.absService instanceof CoordinatorService) {
      // Calling the delete function from the AbsServiceClass and passing the chore to delete.
      this.absService.deleteChoreFromSystem(this.chore).then(chore => {
        // After deleting the chore, removing it from the tenant chore array.
        var index = this.absService.tenant.chores.indexOf(chore)
        if (index > -1) {
          this.absService.tenant.chores.splice(index, 1)
        }
      })
    }
  }

}

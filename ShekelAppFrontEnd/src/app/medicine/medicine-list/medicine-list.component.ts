import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Medicine } from './medicine.modules';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})

export class MedicineListComponent implements OnInit {
  // (property  binding from tenant medicine-array).
  // Initialize an empty array of type Medicine.
  @Input() medicineArray: Medicine[] = []
  // For showing/hiding 'medicine +' button.
  loginType: string = {} as string

  constructor(private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.loginType = this.userTypeService.getUserTypeString()
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void { }

  // This function is called when user type Coordinator/WidthGuide is pressing 
  // on the 'medicine +' button.
  newMedicine() {
    // Navigating to the 'medicine-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToUserTypeEditObjectType
      (this.userTypeService.getUserTypeString(),
        PrivateStringsForApp.getMedicineEnglishString()))
  }

}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { Medicine } from '../medicine.modules';

@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.css']
})

export class MedicineDetailsComponent implements OnInit {
  // (property  binding from 'medicine-list' component).
  // Initialize an empty array of type Medicine.
  @Input() medicine: Medicine = {} as Medicine
  // For showing/hiding 'update' & 'delete' buttons.
  loginType: string = PrivateStringsForApp.getEmptyString()
  // For displaying medicine image.
  imageUrl: SafeUrl = {}

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.loginType = this.userTypeService.getUserTypeString()
    this.absService = userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Getting medicine image byte array from the system.
    this.absService.getMedicineImage(this.medicine.id).then((medicineImageArray: number[]) => {
      // Setting the medicine image field.
      this.medicine.image = medicineImageArray
      // Setting the 'imageUrl' field with the given byte array.
      this.imageUrl = this.absService.setBlobImage(medicineImageArray, this.absService.getServiceSanitizer())
    })

  }

  // This function is called when user type Coordinator/WidthGuide is pressing on the 'update' button.
  updateMedicine() {
    // Saving medicine details in the AbcServiceClass for the 'medicine-edit' component input fields.
    this.absService.medicine = this.medicine
    // Navigating to the 'medicine-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToUserTypeEditObjectType
      (this.loginType, PrivateStringsForApp.getMedicineEnglishString()))
  }

  // This function is called when user type Coordinator/WidthGuide is pressing on the 'delete' button.
  deleteMedicine() {
    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService) {
      // Confirming & deleting medicine from the system.
      if (confirm(PrivateStringsForApp.confirmDeleting(this.medicine.name))) {
        this.absService.deleteMedicine(this.medicine)
      }
    }
  }

}

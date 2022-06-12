import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { Medicine } from '../../medicine.modules';

@Component({
  selector: 'app-medicine-edit',
  templateUrl: './medicine-edit.component.html',
  styleUrls: ['./medicine-edit.component.css']
})

export class MedicineEditComponent implements OnInit, OnDestroy {

  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()

  // Initialize an empty object of type File for apartment image.
  private filename: File = {} as File
  // Initialize an empty object of type Medicine.
  medicine: Medicine = {} as Medicine

  // For image input field.
  image: string | ArrayBuffer | null | undefined | SafeUrl =
    PrivateStringsForApp.getDefaultAssetsString()

  // For checking if to update apartment or to create a new apartment.
  editMode: boolean = false

  constructor(
    private elementRef: ElementRef,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking operation type (update/adding).
    if (this.absService.medicine.id > 0) {
      // If editing medicine details:
      // Setting the medicine details for the input fields.
      this.medicine.id = this.absService.medicine.id
      this.medicine = this.absService.medicine
      this.image = this.absService.setBlobImage(this.medicine.image, this.absService.getServiceSanitizer())
      // Updating medicine details.
      this.editMode = true
    } else {
      // If adding new medicine:
      // Setting image field as the default option.
      this.setDefaultImage()
      // Creating a new medicine.
      this.editMode = false
    }
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgb(83, 229, 78)';
  }

  // This function is called when the user is choosing a image, 
  // for setting the chosen image in the image field. 
  setImage(event: any) {
    AbsServiceClass.setImage(event).then(result => {

      this.filename = result

      this.medicine.image = result
    })

    AbsServiceClass.setImageToBlobType(event).then(blobType => {
      this.image = blobType
    })
  }

  // This function is called when user is submitting the form.
  onSubmit() {
    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService) {
      // Checking the operation type.
      if (!this.editMode) {
        // If adding medicine operation:
        // Calling the function for creating a new medicine in the back-end.
        this.absService.createNewMedicine(this.medicine, this.filename)
      } else {
        // If edit medicine details operation:
        // Calling the function for updating medicine details in the back-end.
        this.absService.updateMedicineDetails(this.medicine, this.filename)
      }
    }
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    // Resetting the medicine fields.
    this.onClear()
    this.medicine.id = 0
    // Navigating back to 'tenant-details' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.userTypeService.getUserTypeString()))
  }

  // This function is called when user is clearing all of the form input fields.
  onClear() {
    this.medicine.amount = this.emptyString
    this.medicine.time = this.emptyString
    this.medicine.name = this.emptyString
    this.image = PrivateStringsForApp.getDefaultAssetsString()
    this.setDefaultImage()
  }

  ngOnDestroy(): void {
    this.onClear()
  }

  // Help function:

  // This function is called for setting the image field as the default image option.
  private setDefaultImage() {
    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService
    ) {
      this.absService.setDefaultImageFile()
      this.absService.blobEmitter.subscribe(res => {
        this.filename = AbsServiceClass.blobToFile(res, this.filename.name)
      })
    }
  }

}

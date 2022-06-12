import { Component, Inject, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { Guide } from '../../guide.modules';

@Component({
  selector: 'app-guide-details',
  templateUrl: './guide-details.component.html',
  styleUrls: ['./guide-details.component.css']
})

export class GuideDetailsComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // For displaying messages on the screen.
  msgDisplay: string = this.emptyString
  // For showing/hiding 'delete guide from apartment guides array' button.
  userType: string = this.emptyString
  // (property binding from 'guides-list' component).
  // Initialize an empty object of type Guide.
  @Input() guide: Guide = {} as Guide
  // Initialize an empty object of type SafeUrl.
  imageUrl: SafeUrl = {} as SafeUrl

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.userType = this.userTypeService.getUserTypeString()
  }

  ngOnInit(): void {
    // Getting guide's image.
    this.absService.getGuideImage(this.guide.id).then(imageByteArray => {
      // Referring the given array to guide's image byte array field.
      this.guide.shekelMember.image = imageByteArray
      // Setting the 'imageUrl' field as the given array.
      this.imageUrl = this.absService.setBlobImage(imageByteArray, this.absService.getServiceSanitizer())
    })
  }

  // This function is called when user type Coordinator is deleting guide from apartment guides array.
  removeGuideFromApartment() {
    if (this.absService instanceof CoordinatorService) {
      // Deleting guide from apartment guides array.
      this.absService.removeGuideFromApartment(this.guide)
    }
  }

}

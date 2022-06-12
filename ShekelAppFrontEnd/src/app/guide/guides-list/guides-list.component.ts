import { Component, Inject, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { Guide } from '../guide.modules';

@Component({
  selector: 'app-guides-list',
  templateUrl: './guides-list.component.html',
  styleUrls: ['./guides-list.component.css']
})

export class GuidesListComponent implements OnInit {
  // Initialize an empty array of type Guide for apartment guides array.
  guides: Guide[] = []
  // Initialize an empty array of type Guide for all guide in the system that aren't apartment guides.  
  guidesInTheSystem: Guide[] = []
  // Initialize an empty object of type Guide.
  selectedGuide: Guide = {} as Guide

  // For checking which array to display.
  apartmentGuidesDisplay: boolean = true
  // For showing/hiding 'add-guide-from-system' div.
  addNewGuideDisplay: boolean = false
  // For showing/hiding '+' button.
  showPlusButton: boolean = false

  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // For displaying 'guide is added to apartment's guides list' success messages.
  msg: string = this.emptyString

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService) {
      // For displaying apartment guides.
      this.absService.getApartmentGuides()
      this.absService.guidesEmitter.subscribe(guidesList => {
        // Checking to which array to refer the emitted array.
        if (this.apartmentGuidesDisplay) {
          // Referring the emitted guide to the 'guidesList' field.
          this.guides = guidesList
          // Showing the '+' button.
          this.showPlusButton = true
        } else {
          this.selectedGuide = guidesList[0]
          this.guidesInTheSystem = guidesList
          this.addNewGuideDisplay = guidesList.length > 0
        }
      })
    }

    if (this.absService instanceof CoordinatorService) {
      // For removing guide from apartment's guides array.
      this.absService.guideEmitter.subscribe(guide => {
        this.guides.splice(this.guides.indexOf(guide), 1)
        setTimeout(() => {
          this.msg = this.emptyString
        }, 1500);
        this.msg = PrivateStringsForApp.showGuideIsRemovedFromApartmentMsg(guide)
      })
    }
  }

  // This function is called when user in pressing the '+' button.
  addPresentGuideToApartment() {
    // Hiding the '+' button.
    this.showPlusButton = false
    // Showing the 'add-guide-from-system' div.
    this.addNewGuideDisplay = true
    if (this.absService instanceof CoordinatorService) {
      // Getting all system guides.
      this.absService.getAllGuides()
      // For referring the emitted array to the 'guidesInTheSystem' field.
      this.apartmentGuidesDisplay = false
    }
  }

  // This function is called when user in pressing the 'adding chosen guide' button.
  addGuideToApartment() {
    if (this.absService instanceof CoordinatorService) {
      // Adding the selected guide to apartment guides array.
      this.absService.addGuideFromSystemToApartment(this.selectedGuide).then(guide => {
        this.guides.unshift(guide)
        // Showing operation success message.
        this.msg = PrivateStringsForApp.showGuideIsAddedToApartmentMsg(guide)

        setTimeout(() => {
          this.msg = this.emptyString
        }, 1700);
      }, error => {
        this.msg = error

        setTimeout(() => {
          this.msg = this.emptyString
        }, 1700);
      })
      // Hiding the 'add-guide-from-system' div & showing the '+' button..
      this.onCancel()
    }
  }

  // This function is called when user type Coordinator is 
  // canceling the 'add system guide to apartment' operation.
  onCancel() {
    // Showing the '+' button.
    this.showPlusButton = true
    // Hiding the 'add-guide-from-system' div.
    this.addNewGuideDisplay = false
  }

}

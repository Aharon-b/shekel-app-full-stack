import { Component, Inject, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { WidthGuide } from '../width-guide-modules';
import { WidthGuideService } from '../width-guide.service';

@Component({
  selector: 'app-width-guide-start',
  templateUrl: './width-guide-start.component.html',
  styleUrls: ['./width-guide-start.component.css']
})

export class WidthGuideStartComponent implements OnInit {

  // Initialize an empty object of type WidthGuide.
  widthGuide: WidthGuide = {} as WidthGuide
  // Initialize an empty array of type Tenant[].
  widthGuideTenants: Tenant[] = []
  // Initialize an empty array of type Apartment[].
  apartmentArray: Apartment[] = []

  // For showing request or offer replacement form.
  kindOfReplacement: boolean = {} as boolean
  // For checking if to show 'change-password-display' component or 'user-start-display' component.
  passwordUpdatedBoolean: boolean = false
  // For showing/hiding 'add-replacement-request-or-offer' component.
  toAddRequest: boolean = false
  // For showing/hiding (when navigating to other components) 'user-start-display' component + 'replacements' button.
  detailsDisplay: boolean = false

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void {
    // Checking user's type.
    if (!(this.absService instanceof WidthGuideService)) {
      // If not WidthGuide type, logging out.
      AbsServiceClass.logout()
    } else {

      // Showing widthGuide details.
      this.detailsDisplay = true
      // For displaying  widthGuide details.
      this.absService.getUserDetails()
      this.absService.userEmitter.subscribe(widthGuide => {
        this.widthGuide = widthGuide
        this.absService.showStartPageElementsEmitter?.subscribe(toShow => {
          // Referring the emitted boolean object to the detailsDisplay boolean field.
          this.detailsDisplay = toShow
        })

        // Getting all widthGuide's tenants.
        this.absService.getUserTenants().then(widthGuideTenants => {
          // Referring the given array to the 'widthGuideTenants' field.
          this.widthGuideTenants = widthGuideTenants
        })
      })

      // Subscribing to the 'showReplacementRequestEmitter' boolean emitter 
      // for showing/hiding 'add-replacement-request-or-offer' component.
      this.absService.showReplacementRequestEmitter.subscribe(toShow => {
        this.toAddRequest = toShow
      })

      // Subscribing to the 'requestOrOfferEmitter' boolean emitter 
      // for showing 'add-replacement-request' component has request/offer replacement.
      this.absService.requestOrOfferEmitter.subscribe(isRequest => {
        this.kindOfReplacement = isRequest
      })
    }

    // Checking if password is updated.
    this.passwordUpdatedBoolean = this.absService.isPasswordUpdated()
    // Subscribing to the 'passwordUpdateEmitter' boolean emitter 
    // for showing/hiding 'change-password' component 
    // (if user wants to update password).
    this.absService.passwordUpdateEmitter.subscribe(passwordUpdated => {
      this.passwordUpdatedBoolean = passwordUpdated
    })
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { Guide } from '../guide.modules';
import { GuideService } from '../guide.service';

@Component({
  selector: 'app-guide-start',
  templateUrl: './guide-start.component.html',
  styleUrls: ['./guide-start.component.css']
})

export class GuideStartComponent implements OnInit {
  // Initialize an empty object of type Guide.
  guide: Guide = {} as Guide
  // Initialize an empty array of type Tenant[].
  guideTenants: Tenant[] = []

  // For showing request or offer replacement form.
  kindOfReplacement: boolean = {} as boolean
  // For checking if to show 'change-password-display' component or 'user-start-display' component.
  passwordUpdatedBoolean: boolean = false
  // For showing/hiding 'add-replacement-request-or-offer' component.
  toAddReplacement: boolean = false
  // For showing/hiding (when navigating to other components) 'user-start-display' component + 'replacements' button. 
  detailsDisplay: boolean = false
  // For displaying purposes on 'replacements-page' component.
  gotRequestArray: boolean = false

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass
  ) {
    this.absService = this.userTypeService.getAbsService()

  }

  ngOnInit(): void {
    // For functions in GuideService class.
    const guideService = (<GuideService>this.absService)
    // Checking user's type.
    if (this.userTypeService.getUserTypeString() !== PrivateStringsForApp.getGuideEnglishString()) {
      // If not Guide type, logging out.
      AbsServiceClass.logout()
    }

    // Showing guide details.
    this.detailsDisplay = true
    // For displaying guide details.
    this.absService.getUserDetails()
    this.absService.userEmitter.subscribe(guide => {
      this.guide = guide
      this.absService.showStartPageElementsEmitter?.subscribe(toShow => {
        // Referring the emitted boolean object to the detailsDisplay boolean field.
        this.detailsDisplay = toShow
      })
    })

    // Getting all guide's tenants.
    this.absService.getUserTenants().then(guideTenants => {
      // Referring the given array to the 'guideTenants' field.
      this.guideTenants = guideTenants
    })

    // Subscribing to the 'showReplacementRequestEmitter' boolean emitter 
    // for showing/hiding 'add-replacement-request-or-offer' component.
    this.absService.showReplacementRequestEmitter.subscribe(toShow => {
      this.toAddReplacement = toShow
    })

    // Subscribing to the 'requestOrOfferEmitter' boolean emitter 
    // for showing 'add-replacement-request' component has request/offer replacement.
    this.absService.requestOrOfferEmitter.subscribe(isRequest => {
      this.kindOfReplacement = isRequest
    })
    // Abling the 'requests' button.
    this.gotRequestArray = true
    // Checking if password is updated.
    this.passwordUpdatedBoolean = this.absService.isPasswordUpdated()
    // Subscribing to the 'passwordUpdateEmitter' boolean emitter 
    // for showing/hiding 'change-password' component 
    // (if user wants to update password).
    this.absService.passwordUpdateEmitter.subscribe(passwordUpdated => {
      this.passwordUpdatedBoolean = passwordUpdated
    })

  }

  // This function is called when guide is pressing on the 'requests' button for navigating 
  // to the 'replacements-table' component.
  replacementsPage() {
    // Hiding the unnecessary items.
    this.absService.showStartPageElementsEmitter?.emit(false)
    // Navigating to the 'replacements-table' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateGuideToReplacementsPage())
  }

}

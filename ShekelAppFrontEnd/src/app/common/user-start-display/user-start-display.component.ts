import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { AbsServiceClass } from '../AbcServiceClass';
import { GetUserTypeService } from '../getUserTypeService';
import { ShekelMember } from '../main-objects/shekelMember.modules';
import { PrivateStringsForApp } from '../PrivateStringsForApp';

@Component({
  selector: 'app-user-start-display',
  templateUrl: './user-start-display.component.html',
  styleUrls: ['./user-start-display.component.css']
})

export class UserStartDisplayComponent implements OnInit {
  // (property  binding from user type start component).
  // Initialize an empty object of type ShekelMember.
  @Input() shekelMember: ShekelMember = {} as ShekelMember
  // Initialize an empty array of type Tenant.
  @Input() userTenants: Tenant[] = []
  // For checking if to show 'add-replacement-offer' button.
  @Input() isGuideUser: boolean = false

  constructor(
    private elementRef: ElementRef,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#66CDAA';
  }

  ngOnInit(): void { }

  // This function is called when user presses on the 'update-details' button.
  updateUserDetails() {
    // Hiding the component.
    this.absService.showStartPageElementsEmitter?.emit(false)
    // Navigating to 'user-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.updateUserDetailsUrl())
  }

  // This function is called when user presses on the 'update-password' button.
  updateUserPassword() {
    // Hiding the component.
    this.absService.showStartPageElementsEmitter?.emit(false)
    // Navigating to 'change-password' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToChangePassword(this.userTypeService.getUserTypeString()))
  }

  // This function is called when user presses on the 'add-Replacement-Request' or 'add-replacement-offer' button.
  addReplacementRequestOrOffer(requestOrOffer: boolean) {
    // Emitting replacement type.
    this.absService.requestOrOfferEmitter.emit(requestOrOffer)
    // Showing the 'add-replacement-request/(in case user is type Guide)->offer' component.
    this.absService.showReplacementRequestEmitter.emit(true)
  }

  // This function is called when user presses on the 'logout' button.
  logOut() {
    AbsServiceClass.logout()
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Chore } from 'src/app/chores/chores.modules';
import { AbsServiceClass } from 'src/app/common/AbcServiceClass';
import { GetUserTypeService } from 'src/app/common/getUserTypeService';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { Tenant } from '../../tenant.modules';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.css']
})

export class TenantDetailsComponent implements OnInit {
  // Initialize an empty object of type Tenant.
  tenant: Tenant = {} as Tenant
  // Initialize an empty object of type SafeUrl.
  imageUrl: SafeUrl = {} as SafeUrl
  // Initialize an empty object of type Subscription.
  subscription: Subscription = {} as Subscription

  // For showing/hiding 'update tenant details' button.
  loginType: string = PrivateStringsForApp.getEmptyString()

  // For display proposes.
  showHr: boolean = false

  constructor(
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass
  ) {
    this.absService = this.userTypeService.getAbsService()
    this.loginType = this.userTypeService.getUserTypeString()
  }

  ngOnInit(): void {
    // Referring the tenant field to AbsService tenant field.
    this.tenant = this.absService.tenant
    // Getting tenant image.
    this.absService.getTenantImage(this.tenant.id).then((imageByteArray) => {
      // Referring the tenant image field to the given Byte array.
      this.tenant.shekelMember.image = imageByteArray
      // Setting the imageUrl field as the tenant image.
      this.imageUrl = this.absService.setBlobImage(imageByteArray, this.absService.getServiceSanitizer())
    })
    // Getting tenant chores array.
    this.absService.getTenantChoresArray(this.tenant.id).then(choresArray => {
      this.tenant.chores = choresArray
      if (choresArray.length === 0) {
        this.showHr = true
      }
    })

    // Getting tenant medicine array.
    this.absService.getTenantMedicineArray(this.tenant.id).then(medicineArray => {
      this.tenant.medicine = medicineArray
      if (medicineArray.length === 0) {
        this.showHr = true
      }
    })

    if (this.absService instanceof CoordinatorService || this.absService instanceof WidthGuideService) {
      // Subscribing to the chore emitter on Coordinator/WidthGuideService.
      this.subscription = this.absService.choreEmitter.subscribe(chore => {
        // Checking if the emitted chore is a new chore or already in the array.
        if (this.checkNewOrUpdateChore(chore)) {
          // Displaying the new chore in 'app-chores-list' component.
          this.tenant.chores.push(chore)
        }
        // Navigating to 'tenant-details' component.
        this.absService.navigateByUrl(PrivateStringsForApp.navigateToTenantDetails(this.loginType))
        // Unsubscribing the choreEmitter in coordinatorService.   
        this.subscription.unsubscribe()
      })
    }
  }

  // When user is pressing 'back to tenants list' button.
  backToTenantsList() {
    // Navigating to the 'apartment-details' component.
    this.absService.navigateByUrl(PrivateStringsForApp.apartmentDisplayUrl(this.loginType))
  }

  // This function is called when user type Coordinator press on the 'update' button.
  updateTenantDetails() {
    // Referring the tenant field in the AbsServiceClass to the tenant field.
    this.absService.tenant = this.tenant
    // Navigating to the 'tenant-edit' component.
    this.absService.navigateByUrl(PrivateStringsForApp.navigateToUserTypeEditObjectType(this.loginType, PrivateStringsForApp.getTenantEnglishString()))
  }

  // This function is called for showing the birth day in the accepted way (11/11/1111) instead of (1111-11-11).
  reverseDate(stringToReverse: string) {
    return AbsServiceClass.reverseDate(stringToReverse)
  }

  // Help function:

  // This function is called when a chore is emitted for checking if its a new chore or a updated one.
  private checkNewOrUpdateChore(chore: Chore) {
    // Checking if the chore is on tenant chore array.
    this.tenant.chores.forEach(tenantChore => {
      // If one of the chores as the same id as the emitted chore means its not a new chore.
      if (tenantChore.id == chore.id) {
        // Updated chore.
        return false
      }
      // End of the array with no results.
      if (this.tenant.chores.length === this.tenant.chores.indexOf(tenantChore)) {
        // New chore.
        return true
      }
      return
    })
    return true
  }

}

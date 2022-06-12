import { Component, OnInit } from '@angular/core';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-tenants-display',
  templateUrl: './all-tenants-display.component.html',
  styleUrls: ['./all-tenants-display.component.css']
})

export class AllTenantsDisplayComponent implements OnInit {
  // Initialize empty object of type Tenant[] for all tenants in the system.
  tenantsArray: Tenant[] = []
  // For checking if to show the table.
  toShowTable: boolean = false
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Getting all tenants in the system.
    this.adminService.getAllTenants()
    // Subscribing to tenants array emitter.
    this.adminService.tenantsEmitter.subscribe(tenantsArray => {
      // Checking if the emitted list is empty.
      if (tenantsArray.length < 1) {
        // If the list is empty, displaying the 'no tenants in the system' element.
        this.toShowTable = true
      }
      // Else, getting tenant's apartment:

      // Referring the array that was emitted to 'tenantsList' array field.
      this.tenantsArray = tenantsArray
      this.tenantsArray.forEach(tenant => {
        this.adminService.getTenantApartmentName(tenant)
      })
    })
  }

  // This function is called when user type admin pressed the 
  // delete button on one of the tenants in the system.
  deleteTenantFromSystem(tenant: Tenant): void {
    // Calling the delete function from the service and passing tenant.
    this.adminService.deleteTenantFromSystem(tenant).then(msg => {
      // After tenant is deleted from the system, 
      // displaying success message on the screen for one second.
      setTimeout(() => {
        // Getting the index of the deleted tenant in the html table.
        const index = this.tenantsArray.indexOf(tenant)
        if (index > -1) {
          // Removing the deleted tenant from the html table.
          this.tenantsArray.splice(index, 1);
        }
        this.msg = PrivateStringsForApp.getEmptyString()
      }, 1000);
      this.msg = msg
    })
  }

}

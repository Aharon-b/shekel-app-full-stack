import { Component, OnInit } from '@angular/core';
import { Apartment } from 'src/app/apartment/apartment.modules';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-all-tenants-no-apartment-display',
  templateUrl: './all-tenants-no-apartment-display.component.html',
  styleUrls: ['./all-tenants-no-apartment-display.component.css']
})

export class AllTenantsNoApartmentDisplayComponent implements OnInit {
  // Initialize empty object of type Tenant[] for all tenants in the system without apartment.
  tenantsNoApartmentArray: Tenant[] = []
  // Initialize empty object of type Tenant for the chosen tenant's name & id.
  tenant: Tenant = {} as Tenant
  // Initialize empty object of type Apartment[] for all apartments in the system.
  apartmentsInSystem: Apartment[] = []
  // Initialize empty object of type Apartment for the chosen apartment.
  selectedApartment: Apartment = {} as Apartment
  // Initialize boolean object for enable/disable the submit button. 
  showSubmitBtn: boolean = false
  // For display purposes.
  defaultTenantName = PrivateStringsForApp.getDefaultTenantName()
  // Initialize string object for the chosen tenant input field as the default option('to choose tenant press on tenant's name').
  tenantName: string = this.defaultTenantName
  // For displaying success/error messages on the screen.
  msg: string = PrivateStringsForApp.getEmptyString()

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    // Getting all tenants in the system with no apartment.
    this.adminService.getAllTenantsWithNoApartment()
    // Subscribing to tenants array emitter.
    this.adminService.tenantsEmitter.subscribe(allTenantsWithNoApartmentArray => {
      // Referring the array that was emitted to 'tenantsNoApartmentList' array field.
      this.tenantsNoApartmentArray = allTenantsWithNoApartmentArray
    })
  }

  chooseTenant(tenant: Tenant): void {
    // To prevent the function from running if the user pressed on the same tenant name twice in a row.
    if (tenant.id !== this.tenant.id) {
      // Referring the chosen tenant to class tenant in case user wants so send the pressed tenant.
      this.tenant = tenant
      // Getting All The apartments in the system with the same gender as tenant's gender. 
      this.adminService.getSystemApartmentsWithTenantGender(tenant)
      // Subscribing to apartments array emitter.
      this.adminService.apartmentsEmitter.subscribe(tenantGenderApartmentsArray => {
        // Referring the chosen tenant name to 'tenantName' field.
        this.tenantName = tenant.shekelMember.firstName + " " + tenant.shekelMember.lastName
        // Referring the first apartment from the array that was emitted to 'selectedApartment' field.
        this.selectedApartment = tenantGenderApartmentsArray[0]
        // Referring the array that was emitted to 'apartmentsInSystem' array field.
        this.apartmentsInSystem = tenantGenderApartmentsArray
        // Enabling the submit button. 
        this.showSubmitBtn = true
      })
    }
  }


  // This function is called when user presses the 'add tenant to apartment' button. 
  addTenantToApartment(): void {
    this.adminService.addTenantToApartment(this.tenant.id, this.selectedApartment.id)
  }

  // This function is called when user mouse is going over the 'tenant name' field element,
  // for showing the default 'tenantName' field in the 'app-screen-msg-display' element
  //  ('for choosing tenant , press on tenant's name'). 
  showDefaultTenantName(): void {
    // Only showing the default message if the user didn't pressed on one of the tenants names. 
    if (this.tenantName === this.defaultTenantName) {
      this.msg = this.defaultTenantName
    }

  }

  // This function is called when user mouse is leaving the 'tenant name' field element, 
  hideDefaultTenantName(): void {
    this.msg = PrivateStringsForApp.getEmptyString()
  }

}

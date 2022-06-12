import { Component, Input, OnInit } from '@angular/core';
import { Tenant } from 'src/app/tenant/tenant.modules';
import { AbsServiceClass } from '../AbcServiceClass';
import { PrivateStringsForApp } from '../PrivateStringsForApp';

@Component({
  selector: 'app-users-tenants',
  templateUrl: './users-tenants.component.html',
  styleUrls: ['./users-tenants.component.css']
})

export class UsersTenantsComponent implements OnInit {
  // (property  binding from user's start page component).
  // Initialize an empty array of type Tenant.
  @Input() userTenants: Tenant[] = []
  // For checking how mach time is left until etch tenant birth day.
  private today: Date = new Date

  constructor() { }

  ngOnInit(): void { }

  /** Etch 'check...' function is checking a closer time then the function that was called before, 
   * (first-> month = yellow , second -> week = red , third -> day = purple) 
   * (if there are no matches tenant's td in the table will stay in a white color) */

  checkMonth(tenant: Tenant) {
    const birthDay = this.setDate(tenant.birthDay)
    birthDay.setFullYear(this.today.getFullYear())
    return (this.today.valueOf() + PrivateStringsForApp.getMonthInMilliSeconds()) > birthDay.valueOf()
      && birthDay.valueOf()! > this.today.valueOf()
  }

  checkWeek(tenant: Tenant) {
    const birthDay = this.setDate(tenant.birthDay)
    birthDay.setFullYear(this.today.getFullYear())
    return birthDay > this.today
      && (this.today.valueOf() + PrivateStringsForApp.getWeekInMilliSeconds()) > birthDay.valueOf()
      && birthDay.getMonth() >= this.today.getMonth()
  }

  checkDay(tenant: Tenant) {
    const birthDay = this.setDate(tenant.birthDay)
    this.setDate(tenant.birthDay)
    return this.today.getMonth() === birthDay.getMonth() && this.today.getDate() === birthDay.getDate()
  }

  // This function is called for showing the birth day in the accepted way (11/11/1111) instead of (1111-11-11).
  reverseDate(tenantsBirthDayAsString: string) {
    return AbsServiceClass.reverseDate(tenantsBirthDayAsString)
  }

  // This function is called for getting tenant's details from the shekelMember field. 
  getTenantDetails(tenant: Tenant) {
    return JSON.parse(JSON.stringify(tenant)).shekelMember
  }

  // Help function:

  private setDate(birthDay: Date): Date {
    return new Date(birthDay)
  }

}

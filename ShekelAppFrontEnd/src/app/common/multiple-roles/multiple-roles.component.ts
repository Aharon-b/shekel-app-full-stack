import { Component, ElementRef, OnInit } from '@angular/core';
import { AbsServiceClass } from '../../common/AbcServiceClass';
import { PrivateStringsForApp } from '../../common/PrivateStringsForApp';
import { CoordinatorService } from '../../coordinator/coordinator.service';
import { GuideService } from '../../guide/guide.service';
import { LoginService } from '../../login/login-service';
import { WidthGuideService } from '../../width-guide/width-guide.service';

@Component({
  selector: 'app-multiple-roles',
  templateUrl: './multiple-roles.component.html',
  styleUrls: ['./multiple-roles.component.css']
})

export class MultipleRolesComponent implements OnInit {

  // All field are for displaying/hiding options in the html file.

  showAdminOption: boolean = false;
  showCoordinatorOption: boolean = false;
  showWidthGuideOption: boolean = false;
  showGuideOption: boolean = false;

  constructor(
    private loginService: LoginService,
    private coordinatorService: CoordinatorService,
    private widthGuideService: WidthGuideService,
    private guideService: GuideService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#A9A9A9';
    // Check if user has roles.
    if (this.loginService.getUserRoles().length === 0) {
      // If not, navigating to the login page.
      this.loginService.navigate(PrivateStringsForApp.getLoginString())
    }

    // Checking which options to show/hide.
    this.loginService.getUserRoles().forEach(role => {

      if (role === PrivateStringsForApp.getRoleAdminString()) {
        this.showAdminOption = true
      }

      if (role === PrivateStringsForApp.getCoordinatorRoleString()) {
        this.showCoordinatorOption = true
      }

      if (role === PrivateStringsForApp.getWidthGuideRoleString()) {
        this.showWidthGuideOption = true
      }

      if (role === PrivateStringsForApp.getGuideRoleString()) {
        this.showGuideOption = true
      }
    })
  }

  // This function is called if user choses to login has admin (navigating to 'admin-start' component).
  logToAdminPage() {
    this.logToUserChoicePage(PrivateStringsForApp.getEnglishAdminString())
  }

  // This function is called if user choses to login has coordinator (navigating to 'coordinator-start' component).
  logToCoordinatorPage() {
    this.logToUserChoicePage(PrivateStringsForApp.getCoordinatorEnglishString(), this.coordinatorService)
  }

  // This function is called if user choses to login has widthGuide (navigating to 'width-guide-start' component).
  logToWidthGuidePage() {
    this.logToUserChoicePage(PrivateStringsForApp.getWidthGuideEnglishString(), this.widthGuideService)
  }

  // This function is called if user choses to login has guide (navigating to 'guide-start' component).
  logToGuidePage() {
    this.logToUserChoicePage(PrivateStringsForApp.getGuideEnglishString(), this.guideService)
  }

  // Help function:

  private logToUserChoicePage(userTypeChoice: string, abcService?: AbsServiceClass) {
    this.loginService.setClientTypeString(userTypeChoice)
    if (abcService) {
      this.loginService.setAbsService(abcService)
    }
    this.loginService.navigate(userTypeChoice)
  }

}

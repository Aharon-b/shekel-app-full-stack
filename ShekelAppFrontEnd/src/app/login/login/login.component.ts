import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { CoordinatorService } from 'src/app/coordinator/coordinator.service';
import { GuideService } from 'src/app/guide/guide.service';
import { WidthGuideService } from 'src/app/width-guide/width-guide.service';
import { LoginService } from '../login-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [CoordinatorService]
})

export class LoginComponent implements OnInit {
  // For setting fields type string as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // For displaying error message on the screen.
  errorMsg: string = this.emptyString
  // For the from fields.
  formGroup: FormGroup = new FormGroup({})

  constructor(
    private coordinatorService: CoordinatorService,
    private widthGuideService: WidthGuideService,
    private guideService: GuideService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Setting 'username' & 'password' values in the 'fromGroup' field.
    this.initForm()
    // Subscribing to the 'errorEmitter' field in the LoginService for displaying error messages on the screen.
    this.loginService.errorEmitter.subscribe(msg => {
      // If there is in error, resetting the 'formGroup' field.
      this.formGroup.reset()
      // Showing the error message on the screen for a minute and a half.
      setTimeout(() => {
        this.errorMsg = this.emptyString
      }, 1500);
      this.errorMsg = msg
    })
  }

  // This function is called when user is submitting the login form.
  login() {
    // Getting the user role array from the system.
    this.loginService.clientType(this.formGroup.value.username, this.formGroup.value.password)
    // Subscribing to the 'userTypeEmitter' field in the LoginService for the userType.
    this.loginService.userTypeEmitter.subscribe((userType) => {
      // If user has more then one role in the system.
      if (userType.length > 1) {
        // Setting the 'userRoles' array field for the 'multiple-roles' component.
        this.loginService.setUserRoles(userType)
        // Navigating to the 'multiple-roles' component.
        this.router.navigate([PrivateStringsForApp.getMultipleRolesString()])

        // If user has only one role in the system.
      } else {
        // Navigating to user's start page according to his role.
        this.checkUserType(userType[0])
      }
    })
  }

  // Help functions:

  // This function is for setting the values in the 'formGroup' field.
  private initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl(this.emptyString, [Validators.required]),
      password: new FormControl(this.emptyString, [Validators.required])
    })
  }

  // This function is for getting the user url from the given userType.
  private checkUserType(userType: String) {
    const splitRoleUrl = userType.toString()
      .substring(PrivateStringsForApp.getSubstringSplitNumberForNavigate())
      .toLocaleLowerCase()

      .replace(PrivateStringsForApp.getLowLine(), PrivateStringsForApp.getHyphen())

    this.setUrlAndNavigate(splitRoleUrl)
  }

  // This function is for setting the user's url & the AbsServiceClass in the LoginService (if not type Admin)
  // and for navigating to the user's start page.
  private setUrlAndNavigate(url: string) {
    if (url === PrivateStringsForApp.getCoordinatorEnglishString()) {
      this.loginService.setAbsService(this.coordinatorService)
    } else if (url === PrivateStringsForApp.getWidthGuideEnglishString()) {
      this.loginService.setAbsService(this.widthGuideService)
    } else if (url === PrivateStringsForApp.getGuideEnglishString()) {
      this.loginService.setAbsService(this.guideService)
    }
    this.loginService.setClientTypeString(url)
    this.router.navigate([url])
  }

}

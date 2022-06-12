import { Component, Inject, Input, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/admin.service';
import { AbsServiceClass } from '../AbcServiceClass';
import { GetUserTypeService } from '../getUserTypeService';
import { PrivateStringsForApp } from '../PrivateStringsForApp';

@Component({
  selector: 'app-change-password-display',
  templateUrl: './change-password-display.component.html',
  styleUrls: ['./change-password-display.component.css']
})

export class ChangePasswordDisplayComponent implements OnInit {
  // For setting fields type String as empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()

  // For form inputs.
  password: string = this.emptyString
  confirmPassword: string = this.emptyString

  // (property binding from user's start page component).
  // Initialize an empty object of type boolean.
  @Input() defaultPassword: boolean = false
  // 
  showPasswordError: boolean = false

  constructor(
    private adminService: AdminService,
    private userTypeService: GetUserTypeService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
  ) {
    this.absService = this.userTypeService.getAbsService()
  }

  ngOnInit(): void { }

  onSubmit() {
    // Checking if there is a match between the 'password' field and the 'confirmPassword' field.
    if (this.password !== this.confirmPassword) {
      // If not:
      // Clearing the fields.
      this.onClear()
      // Alerting 'fields are not the same'.
      alert(PrivateStringsForApp.getFieldsAreNotTheSameError())
    } else {
      // If yes:

      // Checking user's type.
      if (this.userTypeService.getUserTypeString() === PrivateStringsForApp.getEnglishAdminString()) {
        // If user is Admin type:

        // Calling the function for changing admin's password.
        this.adminService.changeAdminPassword(this.password)
        this.adminService.msgEmitter.subscribe(() => {
          // (If any kind of user still has the default password, can't go to home page until changing the default password).
          // After password is changed in the back-end, emitting 'true' for the start page (will show the start page).
          this.adminService.passwordUpdateEmitter.emit(true)
        })
      } else {
        // If user is from type that implements 'AbsServiceClass':

        // Calling the function for changing user's password.
        this.absService.changeUserPassword(this.password)
        this.absService.msgEmitter.subscribe(() => {
          // After password is changed in the back-end.
          // Emitting 'true' for the buttons div in the start page (will show the start page buttons).
          this.absService.showStartPageElementsEmitter?.emit(true)
          // Emitting 'true' for the start page (will show the start page).
          this.absService.passwordUpdateEmitter.emit(true)
          // Navigating to user's start page.
          this.absService.navigateByUrl(this.userTypeService.getUserTypeString())
        })
      }
    }
  }

  // This function is called when user is clearing all of the fields.
  onClear() {
    this.password = this.emptyString
    this.confirmPassword = this.emptyString
  }

  // This function is called when user is canceling the operation.
  onCancel() {
    this.onClear()
    this.absService.showStartPageElementsEmitter?.emit(true)
    this.absService.navigateByUrl(this.userTypeService.getUserTypeString())
  }

  // This function is called when user is leaving the 'password' input field.
  checkPassword() {
    // If the 'password' input field doesn't match the 'confirmPassword' input field.
    if (this.password.length < PrivateStringsForApp.getPasswordMinLength()) {
      // Showing the error paragraph for 3 seconds.
      setTimeout(() => {
        this.showPasswordError = false
      }, 3000);
      this.showPasswordError = true
    }
  }

}

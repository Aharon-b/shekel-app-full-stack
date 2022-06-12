import { Component, Input, OnInit } from '@angular/core';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // All input fields for a case of editing admins details, 
  // in case of adding a new admin to the system the 'username' + 'password' fields will be empty 
  //  and the 'editMode' field will be false. 
  @Input() username: string = this.emptyString
  @Input() password: string = this.emptyString
  @Input() editMode: boolean = false
  // For displaying messages on the screen.
  msg: string = this.emptyString

  constructor(private adminService: AdminService) { }

  ngOnInit(): void { }

  onSubmit(): void {
    // Checking if in case of editMode if there is a new password and if so ,is it shorter then 8 chars.
    if (this.editMode && this.password.length > 0 && this.password.length < PrivateStringsForApp.getPasswordMinLength()) {
      // If all of the conditions are true alerting 'password to short' error
      // (if the password field is empty it will be given is current password in the back-end)
      alert(PrivateStringsForApp.getAdminPasswordToShortError())
    } else {
      if (!this.editMode) {
        // Inserting a new admin to the system.
        this.adminService.addAdminToSystem(this.username).then(username => {
          // Showing success message on the screen.
          this.setTimeOut(PrivateStringsForApp.addedUserToSystemSuccessMsg(username, PrivateStringsForApp.getHebrewAdminString()), 2000)
        })
      } else {
        // Updating admin details.
        this.adminService.updateAdminDetails(this.username, this.password).then(msg => {
          // Showing success/error message on the screen
          this.setTimeOut(msg, 2000)
        })
      }
    }
  }

  // A function for clearing all the fields in the form.
  onClear(): void {
    this.username = ''
    this.password = ''
  }

  // A function for canceling operation.
  onCancel(): void {
    // Hiding the 'admin-edit' component in the present component.
    this.adminService.showEditBooleanEmitter.emit(false)
  }

  // Help function:

  // A function for showing a message on the screen.
  private setTimeOut(msg: string, time: number): void {
    setTimeout(() => {
      this.msg = this.emptyString
      this.onCancel()
    }, time);
    this.msg = msg
  }

}

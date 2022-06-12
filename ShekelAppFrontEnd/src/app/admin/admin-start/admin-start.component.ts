import { Component, ElementRef, OnInit } from '@angular/core';
import { PrivateStringsForApp } from 'src/app/common/PrivateStringsForApp';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-start',
  templateUrl: './admin-start.component.html',
  styleUrls: ['./admin-start.component.css']
})

export class AdminStartComponent implements OnInit {
  // For when fields in the class needs to be empty.
  private emptyString: string = PrivateStringsForApp.getEmptyString()
  // For 'app-edit-admin' component. 
  username: string = this.emptyString
  password: string = this.emptyString
  // For the selected option button.
  onDisplay: string = PrivateStringsForApp.getAdmin_1_MenuSpot()
  // To set the options buttons div when navigating to 'start-admin' component. 
  showOptions: boolean = {} as boolean
  // For entering the 'app-edit-admin' component.
  showEdit: boolean = false
  // When entering the 'app-edit-admin' component, for setting fields.
  editMode: boolean = false
  // For checking if password is updated.
  passwordUpdatedBoolean: boolean = false

  constructor(
    private adminService: AdminService,
    private elementRef: ElementRef) { }

  ngOnInit(): void {

    //Checking if the login fields are empty (prevent attempt to log into the system from url).
    if (this.adminService.checkLoginFields()) {
      // Logging out.
      this.adminService.navigateByUrl(PrivateStringsForApp.getSlash() + PrivateStringsForApp.getLoginString())
    }
    // Checking if user password is updated, if not the 'app-change-default-password' will open.
    this.passwordUpdatedBoolean = this.adminService.isPasswordUpdated()
    // For operating the 'bgc' class on the selected option button.
    this.adminService.positionEmitter.subscribe(selectedOption => {
      // Referring the selected option that was emitted to showOptions field.
      this.onDisplay = selectedOption
    })
    // Setting user token for future operations. 
    this.adminService.setToken()

    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#5F9EA0';
    // For showing/hiding the options div.
    this.adminService.showOptionsBooleanEmitter.subscribe(toShowOptions => {
      // Referring the boolean that was emitted to showOptions field.
      this.showOptions = toShowOptions
    })
    // For showing/hiding the 'app-edit-admin' component. 
    this.adminService.showEditBooleanEmitter.subscribe(toShowEdit => {
      // Referring the boolean that was emitted to showEdit field.
      this.showEdit = toShowEdit
    })

    // For showing/hiding the 'app-change-default-password' component. 
    this.adminService.passwordUpdateEmitter.subscribe(passwordUpdated => {
      // Referring the boolean that was emitted to passwordUpdatedBoolean field.
      this.passwordUpdatedBoolean = passwordUpdated
    })

  }

  // A function for setting the 'editingGuide' in adminService class for 'UserEditComponent'.
  setEditingGuideField(editingGuide: boolean) {
    this.adminService.addingGuide = editingGuide
  }

  // When user clicks on one of the option buttons this function is called.
  setOnDisplay(locationLight: string, url: string): void {
    // In case that 'app-edit-admin' is open.
    this.showEdit = false
    // operating the 'bgc' class on the selected option button.
    this.onDisplay = locationLight
    // Navigating to the selected option component.
    this.adminService.navigateByUrl(url)
  }

  // This function is called when the user presses on the 'Adding admin into system' button. 
  addAdmin(): void {
    this.username = this.emptyString
    this.password = PrivateStringsForApp.getEmptyLongPassword()
    this.editMode = false
    this.showEdit = true
  }

  // This function is called when the user presses on the 'Updating Admin details' button.
  updateAdminDetails(): void {
    // For user's username.
    this.adminService.getAdminUsername()
    this.adminService.adminUsernameEmitter.subscribe(username => {
      // Setting the 'username' field for 'app-edit-admin' on editMode.
      this.username = username
    })
    this.password = this.emptyString
    this.editMode = true
    this.showEdit = true
  }

  // This function is called when the user presses on the 'Deleting admin from system' button.
  deleteAdminFromSystem(): void {
    // Checking if user whats to delete is details from the system in case user has one role
    // or deleting admin-role from user-roles in case user has multiple roles in the system.
    if (confirm(PrivateStringsForApp.getConfirmAdminDeletingAccount())) {
      // Deleting the admin account from the system.
      this.adminService.deleteAdminAccountFromSystem().then(msg => {
        // After admin is deleted alerting the success message and login out of the system.
        alert(msg)
        this.logout()
      })
    }
  }

  // This function is called when the user presses on the 'Logging out' button or when user deletes is account from the system.
  logout(): void {
    // Resetting the 'username' & 'password' fields in the LoginServiceComponent.
    this.adminService.resetLoginFields()
    // The first operation that the 'onInit' function does 
    // is to check if the login details fields are empty and logged out if they are.
    this.ngOnInit()
  }

}

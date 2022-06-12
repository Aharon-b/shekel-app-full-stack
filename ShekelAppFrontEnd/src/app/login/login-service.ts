import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AbsServiceClass } from '../common/AbcServiceClass';
import { PrivateStringsForApp } from '../common/PrivateStringsForApp';
import { LoginStorageService } from './login-storage-service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  // For navigating between components.
  private clientTypeString: string = PrivateStringsForApp.getEmptyString()
  // For getting user type.
  private userRoles: String[] = []

  // For emitting the user type from the back-end.
  userTypeEmitter = new EventEmitter<String[]>()
  // For emitting login error messages.
  errorEmitter = new Subject<string>()

  constructor(
    private loginStorageService: LoginStorageService,
    @Inject(PrivateStringsForApp.getAbsServiceString()) private absService: AbsServiceClass,
    private router: Router
  ) { }

  // This function is called when user is submitting the login form.
  clientType(username: string, password: string) {
    // Getting user roles from the system.
    this.loginStorageService.getUserToken(username, password).subscribe((response) => {
      // Extracting the token from the response.
      const token = response.headers.get(PrivateStringsForApp.getAuthorizationString())

      if (token) {
        // Setting the 'token' field in the LoginStorageService class.
        this.loginStorageService.setToken(token)
        // Getting the user's role.
        this.loginStorageService.clientType(token).subscribe(clientType => {
          // Emitting the given array.
          this.userTypeEmitter.emit(clientType)
        })
      }
      // In case of error.
    }, (error: { status: number }) => {
      if (error.status === 401) {
        // One of the login fields is incurrent.
        this.errorEmitter.next(PrivateStringsForApp.getLoginError())
      } else if (error.status === 0) {
        // System is shot down.
        this.errorEmitter.next(PrivateStringsForApp.getSystemShotDownError())
      }

    })
  }

  // This function is for navigating to user's start page/back to the login page.
  navigate(url: string) {
    this.router.navigateByUrl(url)
  }

  // Getters and Setters:

  getAbsService() {
    const service = this.absService
    return service
  }

  setAbsService(absService: AbsServiceClass) {
    this.absService = absService
  }

  getClientTypeString(): string {
    return this.clientTypeString
  }

  setClientTypeString(loginTypeString: string): void {
    this.clientTypeString = loginTypeString
  }

  getUserRoles(): String[] {
    return this.userRoles
  }

  setUserRoles(userRoles: String[]): void {
    this.userRoles = userRoles
  }

}

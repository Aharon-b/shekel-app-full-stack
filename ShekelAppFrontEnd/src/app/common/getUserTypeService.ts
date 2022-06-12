import { Injectable } from '@angular/core';
import { LoginService } from '../login/login-service';
// This class to determine user type (in case its not Admin type)
@Injectable()
export class GetUserTypeService {

    constructor(private loginService: LoginService) { }

    getAbsService() {
        return this.loginService.getAbsService()
    }

    getUserTypeString() {
        return this.loginService.getClientTypeString()
    }

}
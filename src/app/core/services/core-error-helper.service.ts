import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/security/services";
import { environment } from "environments/environment";
import { CoreHelperService } from "./core-helper.service";

@Injectable({
    providedIn: 'root'
})

export class CoreErrorHelperService {
    constructor(private coreHelperService: CoreHelperService,
        private authenticationService: AuthenticationService,
        private router: Router) { }

    //Below Method will going to handle network errors if any.
    handleNetworkError(errObj: HttpErrorResponse, requestPayload: any) {
        if (!errObj || !errObj.status || errObj.status === 0) {
            this.coreHelperService.swalALertBox('Something went wrong!', 'Error!');
        } else {
            //getting server error if any other wise show default message according to status of server
            const dataObjToShow: { status: number | string; message: string } = { status: errObj.status, message: this.getDefaultErrorMessageFromServerIf(errObj) };

            switch (errObj.status) {
                case 401:
                    //Redirect user with notifying
                    this.redirectUserToLoginPage(dataObjToShow);
                    break;
                case 403:
                    console.log("REQUEST PAYLOAD", requestPayload);
                    const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                    //check jwt is expired or not..
                    if (!!jwt) {
                        if (this.authenticationService.isTokenExpired(jwt)) {
                            //Redirect user with notifying
                            this.redirectUserToLoginPage(dataObjToShow);
                        } else {
                            this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                        }
                    } else {
                        //If No JWT Then Redirect user with notifying
                        this.redirectUserToLoginPage({ message: 'JWT Token not found!', status: 'Error!' });
                    }
                    break;
                default:
                    if (errObj.status === 500) {
                        console.log("REQUEST PAYLOAD", requestPayload);
                    }
                    this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                    break;
            }
            this.printErrorMessageToConsol(dataObjToShow.message)
        }
    }

    //helper function to print error in console if any from server side
    printErrorMessageToConsol(message: any) {
        if (!environment.production && !environment.staging) {
            console.log("ERROR:");
            console.log(message);
        }
    }

    //Get default error message from server if any
    private getDefaultErrorMessageFromServerIf(errObj: HttpErrorResponse) {
        let errorMessage: string = '';
        if (typeof errObj.error === 'string') {
            errorMessage = errObj.error
        } else if (!!errObj.error && !!errObj.error.reason && typeof errObj.error.reason === 'string') {
            errorMessage = errObj.error.reason;
        } else if (!!errObj.error && !!errObj.error.errorMessage && typeof errObj.error.errorMessage === 'string') {
            errorMessage = errObj.error.errorMessage;
        } else if (!!errObj.error && !!errObj.error.message && typeof errObj.error.message === 'string') {
            errorMessage = errObj.error.message;
        } else {
            errorMessage = this.coreHelperService.getMessageStatusWise(Number(errObj.status));
        }
        return errorMessage;
    }

    //Helper function which will redirect user to login page with notifying user.
    private redirectUserToLoginPage(dataObjToShow: { message: string, status: string | number }) {
        this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
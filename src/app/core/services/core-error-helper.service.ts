import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Messages } from "@app/messages/messages";
import { AuthenticationService } from "@app/security/services";
import { environment } from "environments/environment";
import Swal from "sweetalert2";
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
            this.coreHelperService.swalALertBox(Messages.wrongMessage, Messages.commonErrorHeaderText);
        } else {
            //getting server error if any other wise show default message according to status of server
            const dataObjToShow: { status: number | string; message: string } = { status: Messages.commonErrorHeaderText, message: this.getDefaultErrorMessageFromServerIf(errObj) };

            switch (errObj.status) {
                case 401:
                    //Redirect user with notifying
                    this.redirectUserToLoginPage(dataObjToShow, errObj.status);
                    break;
                case 403:
                    console.log("REQUEST PAYLOAD", requestPayload);
                    const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                    //check jwt is expired or not
                    if (!!jwt) {
                        if (this.authenticationService.isTokenExpired(jwt)) {
                            //Redirect user with notifying
                            this.redirectUserToLoginPage(dataObjToShow);
                        } else {
                            this.coreHelperService.swalALertBox(dataObjToShow.message, Messages.commonErrorHeaderText);
                        }
                    } else {
                        //If No JWT Then Redirect user with notifying
                        this.redirectUserToLoginPage({ message: Messages.tokenNotFound, status: Messages.commonErrorHeaderText });
                    }
                    break;
                default:
                    //Rest Of all status code perform over here..
                    if (errObj.status === 500) {
                        console.log("REQUEST PAYLOAD", requestPayload);
                    } else if (errObj.status === 502) {
                        dataObjToShow.message = Messages.status502;
                    }
                    this.coreHelperService.swalALertBox(dataObjToShow.message, Messages.commonErrorHeaderText);
                    break;
            }
            this.printErrorMessageToConsol(dataObjToShow.message)
        }
    }

    //helper function to print error in console if any from server side
    printErrorMessageToConsol(message: any) {
        //Print error in console when system is in development mode
        if (!environment.production && !environment.staging) {
            console.log("ERROR:");
            console.log(message);
        }
    }

    //get messages according to status
    private getMessageStatusWise(status) {
        let msg = "";
        switch (status) {
            case 500: {
                msg = Messages.status500;
                break;
            }
            case 501: {
                msg = Messages.status501;
                break;
            }
            case 502: {
                msg = Messages.status502;
                break;
            }
            case 503: {
                msg = Messages.status503;
                break;
            }
            case 504: {
                msg = Messages.status504;
                break;
            }
            case 505: {
                msg = Messages.status505;
                break;
            }
            case 400: {
                msg = Messages.status400;
                break;
            }
            case 403: {
                msg = Messages.status403;
                break;
            }
            case 404: {
                msg = Messages.status404;
                break;
            }
            case 405: {
                msg = Messages.status405;
            }
            case 406: {
                msg = Messages.status406;
            }
            case 407: {
                msg = Messages.status407;
            }
            case 408: {
                msg = Messages.status408;
            }
            case 415: {
                msg = Messages.status415;
            }
            case 501: {
                msg = Messages.status501;
                break;
            }
            default: {
                msg = Messages.wrongMessage;
                break;
            }
        }
        return msg;
    }

    //Get default error message from server if any
    private getDefaultErrorMessageFromServerIf(errObj: HttpErrorResponse) {
        let errorMessage: string = '';
        //getting error message from server if any available otherwise get default message according to status code
        if (typeof errObj.error === 'string') {
            const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
            if (isHTML(errObj.error)) {
                if (Number(errObj.status) === 200) {
                    // parse html content...
                } else {
                    errorMessage = this.getMessageStatusWise(Number(errObj.status));
                }

            } else {
                errorMessage = errObj.error;
            }
        } else if (!!errObj.error && !!errObj.error.reason && typeof errObj.error.reason === 'string') {
            errorMessage = errObj.error.reason;
        } else if (!!errObj.error && !!errObj.error.errorMessage && typeof errObj.error.errorMessage === 'string') {
            errorMessage = errObj.error.errorMessage;
        } else if (!!errObj.error && !!errObj.error.message && typeof errObj.error.message === 'string') {
            errorMessage = errObj.error.message;
        } else {
            errorMessage = this.getMessageStatusWise(Number(errObj.status));
        }
        return errorMessage;
    }

    //Helper function which will redirect user to login page with notifying user.
    private redirectUserToLoginPage(dataObjToShow: { message: string, status: string | number }, actualStatus: number = 0) {
        if (actualStatus === 401) {
            Swal.fire('Authentication required', dataObjToShow.message, 'warning');
        } else {
            this.coreHelperService.swalALertBox(dataObjToShow.message, Messages.commonErrorHeaderText);
        }
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
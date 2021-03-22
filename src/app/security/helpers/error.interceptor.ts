import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { CoreHelperService } from '@app/core/services/core-helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    requestPayload: any;
    constructor(private authenticationService: AuthenticationService,
        private router: Router,
        private coreHelperService: CoreHelperService) { }

    //Error intersaptor
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requestPayload = request.body;
        return next.handle(request).pipe(catchError(this.errorHandler))
    }


    // error handler
    /*
        todo: https://github.com/threatrix/product/issues/400
            there are some todos in the method belo to point issues related to #400 task
     */
    private errorHandler = (errObj: HttpErrorResponse): Observable<any> => {
        console.log("ErrorInterceptor.errorHandler:");
        console.log("ERROR:");
        console.log(errObj);
        let dataObjToShow: { status: number | string; message: string } = { status: errObj.status, message: '' };
        if (errObj.status === 401 || errObj.status === 403) {
            dataObjToShow.message = (typeof errObj.error === 'string') ? errObj.error : (!!errObj.error && !!errObj.error.message ? errObj.error.message : "Unauthorized user!");
            if (errObj.status === 403) {
                console.log("REQUEST PAYLOAD", this.requestPayload);
                const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                if (!!jwt) {
                    if (this.authenticationService.isTokenExpired(jwt)) {
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                        // todo: SILENT REDIRECT
                    } else {
                        // todo: READ SERVER MESSAGE for alert called next line
                        this.coreHelperService.swalALertBox(this.coreHelperService.getMessageStatusWise(dataObjToShow.status), dataObjToShow.status.toString());
                    }
                }
                else {
                    // todo: MOVE MESSAGE TO RESOURCE FILE
                    this.coreHelperService.swalALertBox("You don't have permission to access / on this server.",dataObjToShow.message);
                    this.router.navigate(['/login']);
                }
            } else {
                this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }

            // todo: put error printing to console in single place
            // PRINTING ERROR MESSAGE TO CONSOLE FOR DEVELOPER ONLY
            this.coreHelperService.printErrorMessageToConsol(dataObjToShow.message);
        } else {
            if (!errObj || !dataObjToShow.status) {
                dataObjToShow.status = "Error!";
                dataObjToShow.message = 'Something went wrong!';
            } else {
                // todo: move message extraction to top of the method as we need server message in higher blocks as well
                if (typeof errObj.error === 'string') {
                    dataObjToShow.message = errObj.error;
                } else if (!!errObj.error && !!errObj.error.reason && typeof errObj.error.reason === 'string') {
                    dataObjToShow.message = errObj.error.reason;
                    // todo: read from errObj.error.error && errObj.error.errorMessage as well
                } else if (!!errObj.error && !!errObj.error.message && typeof errObj.error.message === 'string') {
                    dataObjToShow.message = errObj.error.message;
                } else {
                    dataObjToShow.message = this.coreHelperService.getMessageStatusWise(Number(dataObjToShow.status));
                }

                // todo: make error printing in same manner for all errors
                if (dataObjToShow.status == 500) {
                    console.log("REQUEST PAYLOAD", this.requestPayload);
                }
            }
            this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());

            // todo: put error printing to console in single place
            // PRINTING ERROR MESSAGE TO CONSOLE FOR DEVELOPER ONLY
            this.coreHelperService.printErrorMessageToConsol(dataObjToShow.message);
        }
        console.log("error: " + errObj.message);
        return throwError(errObj);
    }

}

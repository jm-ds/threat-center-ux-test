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


    //error handler
    private errorHandler = (errObj: HttpErrorResponse): Observable<any> => {
        let dataObjToShow: { status: number | string; message: string } = { status: errObj.status, message: '' };
        if (errObj.status === 401 || errObj.status === 403) {
            dataObjToShow.message = !!errObj.error && !!errObj.error.message ? errObj.error.message : "Unauthorized user!";
            if (errObj.status === 403) {
                console.log("REQUEST PAYLOAD", this.requestPayload);
                const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                if (!!jwt) {
                    if (this.authenticationService.isTokenExpired(jwt)) {
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                    } else {
                        this.coreHelperService.swalALertBox(this.coreHelperService.getMessageStatusWise(dataObjToShow.status), dataObjToShow.status.toString());
                    }
                }
                else {
                    this.coreHelperService.swalALertBox("You don't have permission to access / on this server.",dataObjToShow.message);
                    this.router.navigate(['/login']);
                }
                // todo: AT THIS POINT ERROR IS SILENTLY GONE (task: https://github.com/threatrix/product/issues/270)
            } else {
                this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }

            // PRINTING ERROR MESSAGE TO CONSOLE FOR DEVELOPER ONLY
            this.coreHelperService.printErrorMessageToConsol(dataObjToShow.message);
        } else {
            if (!errObj || !dataObjToShow.status) {
                dataObjToShow.status = "Error!";
                dataObjToShow.message = 'Something went wrong!';
            } else {
                if (typeof errObj.error === 'string') {
                    dataObjToShow.message = errObj.error;
                } else if (!!errObj.error && !!errObj.error.reason && typeof errObj.error.reason === 'string') {
                    dataObjToShow.message = errObj.error.reason;
                } else if (!!errObj.error && !!errObj.error.message && typeof errObj.error.message === 'string') {
                    dataObjToShow.message = errObj.error.message;
                } else {
                    dataObjToShow.message = this.coreHelperService.getMessageStatusWise(Number(dataObjToShow.status));
                }

                if (dataObjToShow.status == 500) {
                    console.log("REQUEST PAYLOAD", this.requestPayload);
                }
            }
            this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());

            // PRINTING ERROR MESSAGE TO CONSOLE FOR DEVELOPER ONLY
            this.coreHelperService.printErrorMessageToConsol(dataObjToShow.message);
        }
        console.log("error: " + errObj.message);
        return throwError(errObj);
    }

}

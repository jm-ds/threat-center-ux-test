import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { CoreHelperService } from '@app/core/services/core-helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private router: Router,
        private coreHelperService: CoreHelperService) { }

    //Error intersaptor
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(this.errorHandler))
    }


    //error handler
    private errorHandler = (errObj: HttpErrorResponse): Observable<any> => {
        let dataObjToShow: { status: number | string; message: string } = { status: errObj.status, message: '' };
        if (errObj.status === 401 || errObj.status === 403) {
            dataObjToShow.message = !!errObj.error && !!errObj.error.message ? errObj.error.message : "Unauthorized user!";
            if (errObj.status === 403) {
                const jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
                if (!!jwt) {
                    if (this.authenticationService.isTokenExpired(jwt)) {
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                    } else {
                        this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                    }
                }
                // todo: AT THIS POINT ERROR IS SILENTLY GONE (task: https://github.com/threatrix/product/issues/270)
            } else {
                this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }
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
                    dataObjToShow.message = this.getMessageStatusWise(Number(dataObjToShow.status));
                }
            }
            this.coreHelperService.swalALertBox(dataObjToShow.message, dataObjToShow.status.toString());
        }
        console.log("error: " + errObj.message);
        return throwError(errObj);
    }


    //get messages according to status
    private getMessageStatusWise(status) {
        let msg = "";
        switch (status) {
            case 500: {
                msg = "The server encountered an unexpected condition which prevented it from fulfilling the request.";
                break;
            }
            case 400: {
                msg = "The request had bad syntax or was inherently impossible to be satisfied.";
                break;
            }
            case 403: {
                msg = "The request is for something forbidden. Authorization will not help.";
                break;
            }
            case 404: {
                msg = "The server has not found anything matching the URI given.";
                break;
            }
            case 501: {
                msg = "The server does not support the facility required.";
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
        return msg;
    }
}

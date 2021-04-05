import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { CoreErrorHelperService } from '@app/core/services/core-error-helper.service';
import { Messages } from '@app/messages/messages';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    requestPayload: any;
    constructor(private authenticationService: AuthenticationService,
        private router: Router,
        private coreHelperService: CoreHelperService,
        private coreErrorHelperService: CoreErrorHelperService) { }

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
        this.coreErrorHelperService.handleNetworkError(errObj, this.requestPayload);
        return EMPTY;
    }

}

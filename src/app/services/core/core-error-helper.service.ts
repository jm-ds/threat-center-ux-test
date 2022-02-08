import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthenticationService } from '@app/security/services';
import { AlertService } from '@app/services/core/alert.service';

import { environment } from 'environments/environment';
import { MESSAGES } from '@app/messages/messages';

@Injectable({
  providedIn: 'root'
})

export class CoreErrorHelperService {
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

    //Below Method will going to handle network errors if any.
    handleNetworkError(errObj: HttpErrorResponse, requestPayload: any) {
        if (!errObj || errObj.status === null || errObj.status === undefined) {
          this.alertService.alertBox(MESSAGES.ERROR_MESSAGE, MESSAGES.ERROR_TITLE, 'error');
        } else {
            // Getting server error if any other wise show default message according to status of server
            const dataObjToShow: {
              status: number | string;
              message: string;
            } = {
              status: MESSAGES.ERROR_TITLE,
              message: this.getDefaultErrorMessageFromServerIf(errObj)
            };

            switch (errObj.status) {
                case 401:
                    // Redirect user with notifying
                    this.redirectUserToLoginPage({
                      ...dataObjToShow,
                      status: errObj.status
                    });

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
                          this.alertService.alertBox(dataObjToShow.message, MESSAGES.ERROR_TITLE, 'error');
                        }
                    } else {
                      // If no JWT then redirect user with notifying
                      this.redirectUserToLoginPage({
                        message: MESSAGES.TOKEN_NOT_FOUND,
                        status: MESSAGES.ERROR_TITLE
                      });
                    }
                    break;
                case 400:
                    console.log("REQUEST PAYLOAD", requestPayload);
                    if (Array.isArray(errObj.error.errors)) {
                        let msg = '';
                        errObj.error.errors.forEach(function (element) {
                            msg += "<br/>";
                            msg += element.field.replace(/\b\w/g, l => l.toUpperCase()) + ' ' + element.defaultMessage+'.';
                        });
                        this.alertService.alertBoxHtml(msg,errObj.error.message,'error');
                    } else {
                      this.alertService.alertBox(dataObjToShow.message, MESSAGES.ERROR_TITLE, 'error');
                    }
                    break;
                default:
                    // Rest of all status code perform over here
                    if (errObj.status === 502) {
                      this.alertService.alertBox(MESSAGES.STATUS_502, 'Server is restarting', 'error');
                    } else {
                      if (errObj.status === 500) {
                        console.log('REQUEST PAYLOAD', requestPayload);

                        dataObjToShow.message = 'Invalid username or password!';
                      }
                      this.alertService.alertBox(dataObjToShow.message, MESSAGES.ERROR_TITLE, 'error');
                    }
                    break;
            }
            this.printErrorMessageToConsole(dataObjToShow.message);
        }
    }

  /** Helper function to print error in console if any from server side */
  printErrorMessageToConsole(message: any) {
    // Print error in console when system is in development mode
    if (!environment.production && !environment.staging) {
      console.log('ERROR:');
      console.log(message);
    }
  }

  /** Get messages according to status */
  private getMessageStatusWise(status: number) {
    return MESSAGES[`STATUS_${status}`] || MESSAGES.ERROR_MESSAGE;
  }

    //Get default error message from server if any
    private getDefaultErrorMessageFromServerIf(errObj: HttpErrorResponse) {
        let errorMessage: string = '';
        //getting error message from server if any available otherwise get default message according to status code
        if (typeof errObj.error === 'string') {
            const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
            if (isHTML(errObj.error)) {
                errorMessage = this.getMessageStatusWise(Number(errObj.status));
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

  /** Helper function which will redirect user to login page with notifying user. */
  private redirectUserToLoginPage(dataObjToShow: {
    message: string,
    status: string | number
  }) {
    this.authenticationService.logout();

    this.router.navigate(['/login'], {
      state: {
        data: dataObjToShow.message
      }
    });
  }

  /**
   * Core error handler
   * @param errorSource error source path
   * @param requestPayload optional request payload for interceptor
   * @param consoleError optional custom console error message
   * @param alert optional alert
   * @param error HTTP response error
   * @param source source observable
   * @returns silent empty observable
   */
  errorHandler(
    errorSource: string,
    requestPayload: any,
    consoleError: string,
    alert: Partial<{
      title: string,
      text: string,
      hasHTML: boolean
    }>,
    error: HttpErrorResponse | any,
    source: Observable<any>
  ): Observable<never> {
    this.spinner.hide();

    if (errorSource) {
      console.log(errorSource);
    }

    console.log('ERROR:');
    console.log(error);

    if (consoleError) {
      this.printErrorMessageToConsole(consoleError);
    }

    if (alert || error.message) {
      const showAlert = alert.hasHTML ? this.alertService.alertBoxHtml : this.alertService.alertBox;

      let alertText = alert.text;

      // Alert with error message from server
      if (error.message) {
        alertText = `${alertText} ${error.message})`;
      }

      showAlert(alertText, alert.title, 'error');
    }

    // GraphQL uses network error
    if (requestPayload || error && error.networkError) {
      this.handleNetworkError((error && error.networkError) || error, requestPayload);
    }

    return EMPTY;
  }
}

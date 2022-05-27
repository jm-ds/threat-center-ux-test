import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CoreErrorHelperService } from '@app/services/core/core-error-helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private coreErrorHelperService: CoreErrorHelperService) { }

  /**
   * Error interceptor
   *
   * @param request HTTP request
   * @param next HTTP request handler
   *
   * @returns HTTP event
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestPayload = request.body;

    return next
      .handle(request)
      .pipe(
        catchError((error, caught$) => this.coreErrorHelperService.errorHandler(
          'ErrorInterceptor#intercept',
          requestPayload,
          undefined,
          undefined,
          error,
          caught$
        ))
      );
  }
}

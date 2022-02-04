import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CoreErrorHelperService } from '@app/services/core/core-error-helper.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private coreErrorHelperService: CoreErrorHelperService) { }

  /** Error interceptor */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestPayload = request.body;

    return next
      .handle(request)
      .pipe(
        catchError(
          this.coreErrorHelperService.errorHandler.bind(this, 'ErrorInterceptor#intercept', requestPayload)
        )
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  //Http Inetrsaptor
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    const jwtToken = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
    let existingHeaders = request.headers;
    if (jwtToken && (request.url.includes('user') ||
        request.url.includes('localhost') ||
        request.url.includes('threatrix.io') ||
        request.url.includes('graphql') ||
        request.url.includes('project/upload') ||
        request.url.includes('embedded-asset-state-report') ||
        request.url.includes('license-state-report') ||
        request.url.includes('vulnerability-state-report')
    )) {
      existingHeaders = existingHeaders.set('Authorization', `Bearer ${jwtToken}`);
    } else {
      return next.handle(request.clone());
    }
    const authReq = request.clone({ headers: existingHeaders });
    return next.handle(authReq).pipe(map((event: HttpEvent<any>) => {
      // Handle Http evenst if needs..
      return event;
    }), catchError(err => throwError(err)));
  }
}

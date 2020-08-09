import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { tap } from 'rxjs/operators/tap';
import { Http } from '@angular/http';
import {catchError} from 'rxjs/operators'
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/do';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService,private router: Router,private injector: Injector) { }

    private handleError(err: HttpErrorResponse): Observable<any> {
      console.error("HANDLING ERROR");
        let errorMsg;
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMsg = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMsg = `Backend returned code ${err.status}, body was: ${err.error}`;
        }
        if (err.status === 404 || err.status === 403) {
            console.error("UNAUTHORIZED");
            //this.router.navigateByUrl('/farts');
        }
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // only send JWT token if we're sending  request to our own server.
      if( request.url.includes('user') || request.url.includes('localhost') || request.url.includes('threatrix.io') || request.url.includes('graphql')) {
        // add authorization header with basic auth credentials if available
        const jwt = sessionStorage.getItem("jwt");
        if (jwt) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${jwt}`
            }
          });
        }
      }
      // this whole thing is not working. Entry wrong username
      // and it just redirects back to the fucking login!
      // 401's and 403's are handled in error.intercept. I Need
      // to get this working so that we're sending errors to UX
      return next.handle(request).pipe( tap(() => {},
        (err: any) => {
          if( request.url.includes('localhost') || request.url.includes('threatrix.io') || request.url.includes('graphql')) {
            console.log("AUTH INTERCEPT ERROR",err);
            this.handleError(err);
          }
      }));
    }
}

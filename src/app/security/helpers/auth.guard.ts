import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
  CanDeactivate
} from '@angular/router';

import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { NextConfig } from '@app/app-config';
import { MESSAGES } from '@app/messages/messages';

import { AlertService } from '@app/services/core/alert.service';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService, AuthorizationService } from '../services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AccountService } from '@app/security/services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private accountService: AccountService,
        private authorizationService: AuthorizationService,
        private cookieService: CookieService,
        private corehelperService: CoreHelperService,
        private alertService: AlertService,
        private httpClient: HttpClient
    ) {
    }

  checkPermissionsAndRedirect(auth) {
    console.log(`checkPermissionsAndRedirect`);
    const user = this.authenticationService.currentUser;

    console.log(user);

    if (!user.approved) {
      this.router.navigateByUrl('/awaiting-approval', {
        state: {
          data: MESSAGES.ACCOUNT_APPROVAL_AWAIT
        }
      });
      console.log(`checkPermissionsAndRedirect return false`);
      return false;
    }

    // if logged in and has access rights to current route then return true
    if (this.authorizationService.hasPermissions(auth)) {
      console.log('has permissionsâ€¦');

      // If found any redirect return url from session in oauth case the nevigate user to that page
      if (!!sessionStorage.getItem('ReturnUrl') && sessionStorage.getItem('ReturnUrl') !== '/'
        && sessionStorage.getItem('ReturnUrl') !== '') {
        const returnUrl = sessionStorage.getItem('ReturnUrl');

        sessionStorage.removeItem('ReturnUrl');
        console.log(`checkPermissionsAndRedirect redirecting`);
        this.router.navigate([returnUrl], {
          state: {
            data: MESSAGES.RETURNED_TO_PAGE
          }
        });
      }
      console.log(`checkPermissionsAndRedirect return true`);
      return true;
    } else {
      // otherwise redirect to 'unauthorized' page
      console.log('!!! HAS NO PERMISSIONS !!!');

      this.corehelperService.isUnAuthorize(true);

      return false;
    }
  }

  checkIfJoiningAccounts(jwt: string) {
    console.log(`checkIfJoiningAccounts`);
    const accountToJoin = this.authenticationService.getJoinAccount();
    if (accountToJoin != null && accountToJoin !== undefined ) {
      console.log(`about to attach  ${accountToJoin} to current user`);
      console.log(`jwt is ${jwt}`);
      const url = environment.apiUrl + '/' + this.authenticationService.loginTypeToLoginUrl(accountToJoin) + '?joinUser=true&jwt=' + jwt ;
      this.authenticationService.removeJoinAccount();

      window.location.href = url;

    }
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let jwt = route.queryParams.jwt;
    const hashedJwt = route.queryParams.redirect;
    const username = route.queryParams.username;

    // try to get impersonate jwt token from backend
    if (hashedJwt && username) {
        // browser send two http request in case of impersionation: options and get, so, ignore second request
        if (this.authenticationService.getFromSessionStorageBasedEnv('jwt')) {
            return true;
        }

        this.httpClient
          .get<any>(`${environment.apiUrl}/rest/auth/impersonate?hashedJwt=${hashedJwt}&username=${username}`)
          .pipe(
            first()
          )
          .toPromise()
          .then(
            data => {
              jwt = data.jwt;
            },
            error => {
              console.error(`#canActivate threat center call return error ${JSON.stringify(error)}`);

              return false;
            }
          );
    }

    if (jwt) {
      this.authenticationService.setInSessionStorageBasedEnv('jwt', jwt);
      return await this.accountService
        .loadAuthenticatedUser()
        .pipe(
          map(() => this.checkIfJoiningAccounts(jwt)),
          map(() => this.authenticationService.setLastSuccessfulLogin()),
          map(() => this.checkPermissionsAndRedirect(route.data.auth)),
          first()
        )
        .toPromise();
    } else {
      jwt = this.authenticationService.getFromSessionStorageBasedEnv('jwt');

      if (jwt) {
        if (this.authenticationService.isTokenExpired(jwt)) {
          this.authenticationService.logout();

          this.router.navigate(['/login'], {
            state: {
              data: MESSAGES.TOKEN_EXPIRED
            }
          });
        }

        // if (!this.authenticationService.getFromStorageBasedEnv("currentUser")) {
        //     await this.authenticationService.loadAuthenticatedUser();
        // }

        if (!this.authenticationService.getFromSessionStorageBasedEnv('currentUser')) {
          return await this.accountService
            .loadAuthenticatedUser()
            .pipe(
              map(() => this.checkPermissionsAndRedirect(route.data.auth)),
              first()
            )
            .toPromise();
        }

        return  this.checkPermissionsAndRedirect(route.data.auth);
      }
    }
    if ('invite' in route.queryParams) {
      const invite = route.queryParams.invite;

      this.setInviteCookie(invite);

      this.router.navigate(['/create-account'], {
        queryParams: {
          returnUrl: state.url
        },
        state: {
          data: MESSAGES.ACCOUNT_CREATE_VIA_INVITE
        }
      });

      return false;
    }

    let message = '';

    if (new URL(window.location.href).pathname !== '/') {
      message = MESSAGES.AUTHENTICATE_NEW_USER_SESSION;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: state.url
      },
      state: {
        data: message
      }
    });

    return false;
  }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authorizationService.hasPermissions(childRoute.data.auth);
        return this.checkPermissionsAndRedirect(childRoute.data.auth);
    }
    // sets invite cookie
    setInviteCookie(inviteValue: string) {
        if (!this.cookieService.check('invite')) {
            const expiredDate = new Date();
            expiredDate.setDate(expiredDate.getDate() + NextConfig.config.inviteCookieExpirePeriodDays);
            this.cookieService.set('invite', inviteValue, { expires: expiredDate, sameSite: 'Lax' });
        }
    }
}





export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

}

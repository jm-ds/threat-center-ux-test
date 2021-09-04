import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree, CanDeactivate } from '@angular/router';
import { NextConfig } from '@app/app-config';
import { AlertService } from '@app/core/services/alert.service';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { Messages } from '@app/messages/messages';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService, AuthorizationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authorizationService: AuthorizationService,
        private cookieService: CookieService,
        private corehelperService: CoreHelperService,
        private alertService: AlertService
    ) {
    }


    checkPermissionsAndRedirect(auth) {
        const user = this.authenticationService.currentUser;

        console.log(user);

        if (!user.approved) {
            this.router.navigateByUrl('/awaiting-approval');
            return false;
        }

        // if logged in and has access rights to current route then return true
        if (this.authorizationService.hasPermissions(auth)) {
            console.log("has permissions...");
            //If found any redirect return url from session in oauth case the nevigate user to that page
            if (!!sessionStorage.getItem('ReturnUrl') && sessionStorage.getItem('ReturnUrl') !== '/'
                && sessionStorage.getItem('ReturnUrl') !== '') {
                const returnUrl = sessionStorage.getItem('ReturnUrl')
                sessionStorage.removeItem('ReturnUrl');
                this.router.navigate([returnUrl]);
            }
            return true;
        }
        else {
            // otherwise redirect to "unauthorized" page
            console.log("!!! HAS NO PERMISSIONS !!!");
            this.corehelperService.isUnAuthorize(true);
            return false;
        }
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let jwt = route.queryParams['jwt'];
        if (jwt) {
            this.authenticationService.setInSessionStorageBasedEnv("jwt", jwt);
            await this.authenticationService.loadAuthenticatedUser();
            return this.checkPermissionsAndRedirect(route.data.auth);
        } else {
            jwt = this.authenticationService.getFromSessionStorageBasedEnv("jwt");
            if (jwt) {
                if (this.authenticationService.isTokenExpired(jwt)) {
                    this.authenticationService.logout();
                    this.router.navigate(['/login'], { state: { data: Messages.tokenExpired } });
                }
                // if (!this.authenticationService.getFromStorageBasedEnv("currentUser")) {
                //     await this.authenticationService.loadAuthenticatedUser();
                // }
                if (!this.authenticationService.getFromSessionStorageBasedEnv("currentUser")) {
                    await this.authenticationService.loadAuthenticatedUser();
                }
                return this.checkPermissionsAndRedirect(route.data.auth);
            }
        }
        if ('invite' in route.queryParams) {
            const invite = route.queryParams['invite'];
            this.setInviteCookie(invite);
            this.router.navigate(['/create-account'], { queryParams: { returnUrl: state.url } });
            return false
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }, state: { data: 'Please authenticate with the new user session.' } });
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authorizationService.hasPermissions(childRoute.data.auth);
        return this.checkPermissionsAndRedirect(childRoute.data.auth);
    }
    // sets invite cookie
    setInviteCookie(inviteValue: string) {
        if (!this.cookieService.check('invite')) {
            let expiredDate = new Date();
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

    canDeactivate(component: CanComponentDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

}

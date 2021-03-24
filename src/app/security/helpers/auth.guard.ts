import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree, CanDeactivate } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService, AuthorizationService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authorizationService: AuthorizationService
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
            if (!!sessionStorage.getItem('ReturnUrl') && sessionStorage.getItem('ReturnUrl') !== '/' && sessionStorage.getItem('ReturnUrl') !== '') {
                const returnUrl = sessionStorage.getItem('ReturnUrl')
                sessionStorage.removeItem('ReturnUrl');
                this.router.navigate([returnUrl]);
            }
            return true;
        }
        else {
            // otherwise redirect to "unauthorized" page
            console.log("!!! HAS NO PERMISSIONS !!!");
            this.router.navigateByUrl('/unauthorized');
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
                    this.router.navigate(['/login']);
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
        debugger;
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // return this.authorizationService.hasPermissions(childRoute.data.auth);
        return this.checkPermissionsAndRedirect(childRoute.data.auth);
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
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import {AuthenticationService, AuthorizationService} from '../services';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authorizationService: AuthorizationService
    ) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let jwt = route.queryParams['jwt'];
        if (jwt) {
            sessionStorage.setItem("jwt", jwt);
            await this.authenticationService.loadAuthenticatedUser();
            return this.authorizationService.hasPermissions(route.data.auth);
        } else {
            jwt = sessionStorage.getItem("jwt");
            if (jwt) {
                if (this.authenticationService.isTokenExpired(jwt)) {
                    this.router.navigate(['/login']);
                }
                if (!localStorage.getItem("currentUser")) {
                    await this.authenticationService.loadAuthenticatedUser();
                }
                // logged in so return true
                return this.authorizationService.hasPermissions(route.data.auth);
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authorizationService.hasPermissions(childRoute.data.auth);
    }
}

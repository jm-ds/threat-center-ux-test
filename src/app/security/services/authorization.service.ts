import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

    // set this to true so authz service return true in any case
    private readonly FAIL_VALUE = false;
    user;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
    ) {
        // this.user = this.authService.getFromStorageBasedEnv("currentUser");
        this.user = this.authService.getFromSessionStorageBasedEnv("currentUser");
    }

    hasPermissions(auth: string[] | string): boolean {

        if (this.FAIL_VALUE) {
            console.error("!!! EXTREME VIOLATION !!! Authorization Service is set to skip failed conditions and always grant access.");
        }

        if (this.authService.currentUser) {
            if (auth === null || auth === undefined) {
                console.error("Authorization Service Error: unauthorized access is restricted.");
                return this.FAIL_VALUE;
            }


            if (!Array.isArray(auth) && typeof auth !== "string") {
                console.error("Authorization Service Error: wrong type of permissions argument.");
                return this.FAIL_VALUE;
            }

            if (typeof auth === "string") {
                auth = [auth];
            }

            const permissions = this.getConsolidatedPermissionList();
            if (permissions.length === 0) {
                console.error("Authorization Service Warning: user does not have any permissions.");
            }

            // add this specific permissions to everybody who authenticated so we could skip listing all permissions on root route
            permissions.push("AUTHENTICATED");

            let hasAuth = false;

            for (let authPermission of auth) {
                for (let userPermission of permissions) {
                    if (authPermission === userPermission) {
                        hasAuth = true;
                        break;
                    }
                }
                if (hasAuth) {
                    break;
                }
            }

            return this.FAIL_VALUE || hasAuth;
        }

        //console.error("Authorization Service Error: user not found.");
        return false;
    }

    private getConsolidatedPermissionList(): string[] {
        let authorities = this.authService.currentUser.authorities.map(a => a.authority);
        return authorities;
    }
}
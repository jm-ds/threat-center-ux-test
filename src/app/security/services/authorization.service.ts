import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AuthenticationService} from './authentication.service';

@Injectable({providedIn: 'root'})
export class AuthorizationService {

    // set this to true so authz service return true in any case
    private readonly FAIL_VALUE = false;


    user = localStorage.getItem("currentUser");

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) {
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

        console.error("Authorization Service Error: user not found.");
        return false;
    }

    private getConsolidatedPermissionList(): string[] {
        const user = this.authService.currentUser;

        if (user === null || user === undefined) {
            console.error("Authorization Service Error: user not found.");
        }

        let permissions: string[] = [];

        if (user.roles != null && user.roles.length > 0) {
            for (let role of user.roles) {
                if (role.permissions != null && role.permissions.length > 0) {
                    permissions = permissions.concat(role.permissions);
                }
            }
        }

        if (user.permissions != null && user.permissions.length > 0) {
            permissions = permissions.concat(user.permissions);
        }

        permissions = permissions.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });

        return permissions;
    }
}

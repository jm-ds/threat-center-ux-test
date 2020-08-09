import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {AuthenticationService} from './authentication.service';
import { User } from '../../models';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

    user = localStorage.getItem("currentUser");

    constructor(
      private http: HttpClient,
      private authService: AuthenticationService) { }

    has(auth:string):boolean {
      if(this.authService.currentUser ) {
        let hasAuth = this.authService.currentUser.permissions.includes(auth);
        console.log("HAS AUTH ", hasAuth);
        return hasAuth;
      }
      return false;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first,map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { User } from '../../models';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUser(): User {
      // note: I don't think the loading is working in constructor
      if ((!this.currentUserSubject || !this.currentUserSubject.value) && localStorage.getItem('currentUser')) {
        console.log("Current user subject is null. Loading from localStorage")
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      }
      return this.currentUserSubject.value;
    }

    loadAuthenticatedUser() {
      const url = environment.apiUrl + '/user';
      return this.http.get<any>(url)
        .pipe(first())
        .subscribe(user => {
          // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        });
    }

    login(username: string, password: string) {
        const url = environment.apiUrl + '/authenticate';
        const body = {
          username: username,
          password: password
        };
        return this.http.post<any>(url, body)
          .pipe(map(response => {
              // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
              console.log("JWT",response.jwt);
              sessionStorage.setItem("jwt",response.jwt);
              const user = response.user;
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
          },
          (err) => {
            console.error("AUTH SERVICE ERROR:",err);
          }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('currentUser');
        console.log("Logout called");
        sessionStorage.removeItem("jwt");
        this.currentUserSubject.next(null);
    }

    public isTokenExpired(token?: string): boolean {
      if(!token) return true;
      const date = this.getTokenExpirationDate(token);
      if(date === undefined) return false;
      return !(date.valueOf() > new Date().valueOf());
    }

    getTokenExpirationDate(token: string): Date {
      const decoded = jwt_decode(token);
      if (decoded.exp === undefined) return null;
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }
}

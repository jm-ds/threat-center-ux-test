import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import * as jwt_decode from 'jwt-decode';
import { User } from '../../models';
import { environment } from '../../../environments/environment';
import { LocalService } from '@app/core/services/local.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient, private localService: LocalService) {
    // let user = this.getFromStorageBasedEnv('currentUser');
    let user = this.getFromSessionStorageBasedEnv('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(user);
  }

  public get currentUser(): User {
    // note: I don't think the loading is working in constructor
    if ((!this.currentUserSubject || !this.currentUserSubject.value) && this.getFromSessionStorageBasedEnv('currentUser')) {
      console.log("Current user subject is null. Loading from localStorage")
      this.currentUserSubject = new BehaviorSubject<User>(this.getFromSessionStorageBasedEnv('currentUser'));
    }
    return this.currentUserSubject.value;
  }

  async loadAuthenticatedUser() {
    const url = environment.apiUrl + '/user';
    let user = await this.http.get<any>(url).toPromise();

    // this.setInStorageBasedEnv('currentUser', user);

    //storing user data to session storage.
    this.setInSessionStorageBasedEnv('currentUser',user);
    return user;
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
        console.log("JWT", response.jwt);
        this.setInSessionStorageBasedEnv('jwt', response.jwt);
        const user = response.user;

        //now we do not need to store data to local storage
        // this.setInStorageBasedEnv('currentUser', user);
        
        //storing current user details to session storage.
        this.setInSessionStorageBasedEnv("currentUser",user);

        this.currentUserSubject.next(user);
        return user;
      },
        (err) => {
          console.error("AUTH SERVICE ERROR:", err);
        }));
  }

  createAccount(email: string, fullName: string, phone: string, password: string, companyName: string) {
    // todo[5]: don't forget to that "this.host_url" to "environment.apiUrl" on merge
    const url = environment.apiUrl + '/account/create';
    const body = { email, fullName, phone, password, companyName };
    return this.http.post<any>(url, body)
      .pipe(map(response => {
        const user = response.user;
        return user;
      },
        (err) => {
          console.error('AUTH SERVICE ERROR:', err);
        }));
  }

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('currentUser');
    console.log("Logout called");
    this.localService.clearToken();
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) return true;
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  setInStorageBasedEnv(key: string, data: User) {
    if (environment.production && !environment.staging) {
      this.localService.setLocalStorage(key, data);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }


  getFromStorageBasedEnv(key: string) {
    let user = null;
    if (environment.production && !environment.staging) {
      user = this.localService.getLocalStorage(key);
    } else {
      if (localStorage.getItem(key)) {
        user = JSON.parse(localStorage.getItem(key));
      }
    }
    return user;
  }

  setInSessionStorageBasedEnv(key: string, data: User) {
    if (environment.production && !environment.staging) {
      this.localService.setSessionStorage(key, data);
    } else {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  getFromSessionStorageBasedEnv(key: string) {
    let user = null;
    if (environment.production && !environment.staging) {
      user = this.localService.getSessionStorage(key);
    } else {
      if (sessionStorage.getItem(key)) {
        user = JSON.parse(sessionStorage.getItem(key));
      }
    }
    return user;
  }
}

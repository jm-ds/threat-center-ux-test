import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import * as jwt_decode from 'jwt-decode';
import { OrganizationData, User } from '../../models';
import { environment } from '../../../environments/environment';
import { LocalService } from '@app/services/core/local.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public currentUserSubject: BehaviorSubject<User>;
  private websocketClient = null;

  constructor(private http: HttpClient, private localService: LocalService,
    private modalService: NgbModal,
    private cookieService: CookieService) {
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
        this.setCurrentLogin(LoginType.PASSWORD);

        this.currentUserSubject.next(user);
        return user;
      },
        (err) => {
          console.error("AUTH SERVICE ERROR:", err);
        }));
  }

  createAccount(email: string, fullName: string, phone: string, password: string, companyName: string, position: string, coverLetter: string, inviteHash: string) {
    // todo[5]: don't forget to that "this.host_url" to "environment.apiUrl" on merge
    const url = environment.apiUrl + '/account/create';
    const body = { email, fullName, phone, password, companyName, position, coverLetter, inviteHash };
    return this.http.post<any>(url, body)
      .pipe(map(response => {
        this.setInSessionStorageBasedEnv('jwt', response.jwt);
        const user = response.user;
        this.setInSessionStorageBasedEnv("currentUser",user);
        this.cookieService.delete('invite')
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
    sessionStorage.removeItem("ProjectBreadcum");
    sessionStorage.removeItem("UserPreference");
    sessionStorage.removeItem("REPO_SCAN");
    sessionStorage.removeItem("AssetFilter");
    sessionStorage.removeItem("currentLogin")
    this.modalService.dismissAll();
    this.currentUserSubject.next(null);
    this.closeWebSocket();
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
      if (sessionStorage.getItem(key) && sessionStorage.getItem(key) != "undefined") {
        user = JSON.parse(sessionStorage.getItem(key));
      }
    }
    return user;
  }

  // set websocket client
  setWebSocketClient(wsClient) {
    this.websocketClient = wsClient;
  }

  // close websocket
  closeWebSocket() {
    if (!!this.websocketClient) {
      this.websocketClient.unsubscribeAll();
      this.websocketClient.close(true);
      this.websocketClient = null;
    }
  }

  // get available github repository type from cookie
  getGitHubRepoType() {
    if (this.cookieService.check('gh_rt')) {
      return this.cookieService.get('gh_rt');
    } else {
      return undefined;
    }
  }

  // save github repository type in cookie
  setGitHubRepoType(value: string) {
    let expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 181); // valid 181 days
    this.cookieService.set('gh_rt', value, {path: '/',  expires: expiredDate, sameSite: 'Lax' });
  }

  //todo save
  setLastSuccessfulLogin(loginType: LoginType, accountName: string) {
    console.log(`setting last successful login to ${loginType} , ${accountName}` );
    let expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 181); // valid 181 days
    let jsonLoginData = {
      loginType: loginType,
      accountName: accountName
    };

    this.cookieService.set('last_login', JSON.stringify(jsonLoginData), {path: '/',  expires: expiredDate, sameSite: 'Lax' });
  }

  getLastSuccessfulLogin() {
    if (this.cookieService.check('last_login')) {
      return this.cookieService.get('last_login');
    } else {
      return undefined;
    }
  }

  setCurrentLogin(loginType: LoginType) {
    if (environment.production && !environment.staging) {
      this.localService.setSessionStorage("currentLogin", loginType);
    } else {
      sessionStorage.setItem("currentLogin", loginType);
    }
 }

  getCurrentLogin() {
    if (environment.production && !environment.staging) {
      return this.localService.getSessionStorage("currentLogin");
    } else {
      return sessionStorage.getItem("currentLogin")
    }
  }

  getJoinAccount() {
    if (environment.production && !environment.staging) {
      return this.localService.getSessionStorage("accountToJoin");
    } else {
      return sessionStorage.getItem("accountToJoin")
    }
  }

  setJoinAccount(loginType: LoginType) {
    if (environment.production && !environment.staging) {
      this.localService.setSessionStorage("accountToJoin", loginType);
    } else {
      sessionStorage.setItem("accountToJoin", loginType);
    }
  }

  removeJoinAccount() {
    sessionStorage.removeItem("accountToJoin");
  }


  loginTypeToLoginUrl(loginType: LoginType) {
    switch (loginType) {
      case LoginType.BITBUCKET:
        return "bitbucket_login";
      case LoginType.GITHUB:
        return "github_login";
      case LoginType.GITLAB:
        return "gitlab_login";
      case LoginType.GOOGLE:
        return "google_login";
      case LoginType.PASSWORD:
        return undefined;
    }
  }

 }

 export enum LoginType {
   GITHUB = 'github',
   GITLAB = 'gitlab',
   BITBUCKET = 'bitbucket',
   GOOGLE = 'google',
   PASSWORD = 'password'


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

import { LocalService } from '@app/services/core/local.service';

import { User } from '../../models';

import { Account, RepositoryAccounts } from '@app/threat-center/shared/models/types';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  private websocketClient = null;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private localService: LocalService,
    private cookieService: CookieService
  ) {
    // let user = this.getFromStorageBasedEnv('currentUser');
    const user = this.getFromSessionStorageBasedEnv('currentUser');

    this.currentUserSubject = new BehaviorSubject<User>(user);
  }

  public get currentUser(): User {
    // note: I don't think the loading is working in constructor
    if ((!this.currentUserSubject || !this.currentUserSubject.value) && this.getFromSessionStorageBasedEnv('currentUser')) {
      console.log('Current user subject is null. Loading from localStorage');
      this.currentUserSubject = new BehaviorSubject<User>(this.getFromSessionStorageBasedEnv('currentUser'));
    }
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const url = environment.apiUrl + '/rest/auth/authenticate';
    const body = {
      username: username,
      password: password
    };
    return this.http.post<any>(url, body)
      .pipe(map(response => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        console.log('JWT', response.jwt);
        this.setInSessionStorageBasedEnv('jwt', response.jwt);
        const user = response.user;

        // now we do not need to store data to local storage
        // this.setInStorageBasedEnv('currentUser', user);

        // storing current user details to session storage.
        this.setInSessionStorageBasedEnv('currentUser', user);
        this.setCurrentLogin(LoginType.PASSWORD);

        this.currentUserSubject.next(user);
        return user;
      },
        (err) => {
          console.error('AUTH SERVICE ERROR:', err);
        }));
  }

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('currentUser');
    console.log('Logout called');
    this.localService.clearToken();
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('ProjectBreadcum');
    sessionStorage.removeItem('UserPreference');
    sessionStorage.removeItem('REPO_SCAN');
    sessionStorage.removeItem('AssetFilter');
    sessionStorage.removeItem('currentLogin');
    this.modalService.dismissAll();
    this.currentUserSubject.next(null);
    this.closeWebSocket();
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) { return true; }
    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) { return null; }
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

  setInSessionStorageBasedEnv(key: string, data: any) {
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
      if (sessionStorage.getItem(key) && sessionStorage.getItem(key) !== 'undefined') {
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
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 181); // valid 181 days
    this.cookieService.set('gh_rt', value, {path: '/',  expires: expiredDate, sameSite: 'Lax' });
  }

  setLastSuccessfulLogin(user: User) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 181); // valid 181 days
    if (user.repositoryAccounts) {
      const userLoginInfo = {
        username: user.username,
        github: user.repositoryAccounts.githubAccount,
        gitlab: user.repositoryAccounts.gitlabAccount,
        bitbucket: user.repositoryAccounts.bitbucketAccount,
        google: user.repositoryAccounts.googleAccount
      } as LoginData;
      console.log(`setting last successful login info for user ${user.username} to ${JSON.stringify(userLoginInfo)}`);
      this.cookieService.set('last_login_data', JSON.stringify(userLoginInfo), {path: '/',  expires: expiredDate, sameSite: 'Lax' });
    }
  }

  toLoginData(repositoryAccounts: RepositoryAccounts): Map<string, Account> {
    const accounts = new Map<string, Account>();
    if (repositoryAccounts.githubAccount) {
      accounts.set('github', repositoryAccounts.githubAccount);
    }
    if (repositoryAccounts.gitlabAccount) {
      accounts.set('gitlab', repositoryAccounts.gitlabAccount);
    }
    if (repositoryAccounts.bitbucketAccount) {
      accounts.set('bitbucket', repositoryAccounts.bitbucketAccount);
    }
    if (repositoryAccounts.googleAccount) {
      accounts.set('google', repositoryAccounts.googleAccount);
    }
    return accounts;
  }


  getLastSuccessfulLogin(): LoginData {
    if (this.cookieService.check('last_login_data')) {
      return JSON.parse(this.cookieService.get('last_login_data'));
    } else {
      return undefined;
    }
  }

  setCurrentLogin(loginType: LoginType) {
    if (environment.production && !environment.staging) {
      this.localService.setSessionStorage('currentLogin', loginType);
    } else {
      sessionStorage.setItem('currentLogin', loginType);
    }
 }

  getCurrentLogin() {
    if (environment.production && !environment.staging) {
      return this.localService.getSessionStorage('currentLogin');
    } else {
      return sessionStorage.getItem('currentLogin');
    }
  }

  getJoinAccount() {
    if (environment.production && !environment.staging) {
      return this.localService.getSessionStorage('accountToJoin');
    } else {
      return sessionStorage.getItem('accountToJoin');
    }
  }

  setJoinAccount(loginType: LoginType) {
    if (environment.production && !environment.staging) {
      this.localService.setSessionStorage('accountToJoin', loginType);
    } else {
      sessionStorage.setItem('accountToJoin', loginType);
    }
  }

  removeJoinAccount() {
    sessionStorage.removeItem('accountToJoin');
  }


  loginTypeToLoginUrl(loginType: LoginType) {
    switch (loginType) {
      case LoginType.BITBUCKET:
        return 'bitbucket_login';
      case LoginType.GITHUB:
        return 'github_login';
      case LoginType.GITLAB:
        return 'gitlab_login';
      case LoginType.GOOGLE:
        return 'google_login';
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

export interface LoginData {
  username: string;
  github: Account;
  gitlab: Account;
  bitbucket: Account;
  google: Account;
}


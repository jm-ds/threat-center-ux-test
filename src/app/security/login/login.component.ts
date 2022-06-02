import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { AuthenticationService, LoginData, LoginType } from '../services';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  error = '';
  model: any = {};
  errorMessage: string;
  apiUrl: string;
  loginPageError = '';
  choosenRepoType = 'private';
  currentLogin: LoginType;
  previousLoginUserName: string;
  previousLoginType: LoginType;
  createNewUser = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUser) {
      this.router.navigate(['/']);
    }
    this.apiUrl = environment.apiUrl;
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as { data: string };
    this.loginPageError = !!state && !!state.data ? state.data : null;
  }

  ngOnInit() {
    //sessionStorage.setItem('token', '');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.errorMessage = this.route.snapshot.queryParams['error'];
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.error('LOGIN ERROR', error);
          this.error = error;
          this.loading = false;
        });
  }

  checkCreateNewUserAndLogin() {
    if (!this.createNewUser) {
      console.info(`going to login with ${this.previousLoginType} then join the account with ${this.currentLogin}`);
      this.authenticationService.setJoinAccount(this.currentLogin);
      this.redirectToExternalLogin(this.apiUrl + '/rest/auth/' + this.authenticationService.loginTypeToLoginUrl(this.previousLoginType));
    } else {
      console.info(`going to login with ${this.currentLogin}`);
      this.redirectToExternalLogin(this.apiUrl + '/rest/auth/' + this.authenticationService.loginTypeToLoginUrl(this.currentLogin));
    }
  }

  // login via external oauth
  externalLogin(urlText: string, previousLoginDialog, repoTypeDialog) {
    console.info('login.component - external login');
    this.setCurrentLogin(urlText);
    const lastSuccessfulLoginData: LoginData = this.authenticationService.getLastSuccessfulLogin();
    if (lastSuccessfulLoginData) {
      console.info(`last successful login ${JSON.stringify(lastSuccessfulLoginData)}`);

      this.currentLogin = this.getLoginTypeFromUrl(urlText);
      this.previousLoginUserName = lastSuccessfulLoginData.username;
      let lastLoginType;
      // TODO with bitbucket and google auth type that code won't work
      // TODO redirect to password authentication if last login type was password
      if (this.currentLogin === LoginType.GITHUB
        && lastSuccessfulLoginData.gitlab
        && !lastSuccessfulLoginData.github) {
        lastLoginType = LoginType.GITLAB;
      }
      if (this.currentLogin === LoginType.GITLAB
        && lastSuccessfulLoginData.github
        && !lastSuccessfulLoginData.gitlab) {
        lastLoginType = LoginType.GITHUB;
      }
      if (lastLoginType) {
        console.info(`setting previous login type to ${lastLoginType}`);
        if (lastLoginType) {
          this.previousLoginType = lastLoginType;
          // ask user if he wants to join the accounts
          this.openDialog(previousLoginDialog);
          return;
        }
      }
    }

    let param;
    if (urlText === 'github_login') {
      const repotype = this.authenticationService.getGitHubRepoType();
      if (!repotype) {
        // show repo type dialog
        this.openDialog(repoTypeDialog);
        return;
      } else {
        if (repotype === 'private') {
          param = 'needPrivateRepos=true';
        }
      }
    }
    this.loading = true;
    this.redirectToExternalLogin(this.apiUrl + '/rest/auth/' + urlText + (!!param ? '?' + param : ''));
  }

  // redirect to authenticate url
  redirectToExternalLogin(url: string)   {
    // TODO logs
    console.log(`redirectToExternalLogin`);
    console.log(`this.returnUrl is ${this.returnUrl}`);

    if (!!this.returnUrl && this.returnUrl !== '' && this.returnUrl !== '/') {
      sessionStorage.setItem('ReturnUrl', this.returnUrl);
    }
    window.location.href = url;
  }

  // open repo type dialog
  openDialog(content) {
    this.modalService.open(content, { windowClass: 'md-class', centered: true });
  }

  // save repo type
  setGithubRepoType() {
    this.authenticationService.setGitHubRepoType(this.choosenRepoType);
    let param;
    if (this.choosenRepoType === 'private') {
      param = 'needPrivateRepos=true';
    }
    this.redirectToExternalLogin(this.apiUrl + '/rest/auth/github_login' + (!!param ? '?' + param : ''));
  }

  getLoginTypeFromUrl(url: string) {
    if (url.toLowerCase().includes('github')) {
      return LoginType.GITHUB;
    }
    if (url.toLowerCase().includes('gitlab')) {
      return LoginType.GITLAB;
    }
    if (url.toLowerCase().includes('bitbucket')) {
      return LoginType.BITBUCKET;
    }
    if (url.toLowerCase().includes('google')) {
      return LoginType.GOOGLE;
    }
    return undefined;
  }

  setCurrentLogin(url: string) {
    const type = this.getLoginTypeFromUrl(url);
    console.log('setting current login to ' + type);
    this.authenticationService.setCurrentLogin(type);
  }

}

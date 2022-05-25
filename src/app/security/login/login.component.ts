import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services';
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
  loginPageError:string = '';
  choosenRepoType: string = 'private';

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
          console.error("LOGIN ERROR", error);
          this.error = error;
          this.loading = false;
        });
  }

  // login via external oauth
  externalLogin(urlText: string, repoTypeDialog) {
    let param;
    if (urlText === 'github_login') {
      const repotype = this.authenticationService.getGitHubRepoType();
      if (!repotype) {
        // show repo type dialog
        this.openRepoTypeDialog(repoTypeDialog);
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
    if (!!this.returnUrl && this.returnUrl !== '' && this.returnUrl !== '/') {
      sessionStorage.setItem('ReturnUrl', this.returnUrl);
    }
    window.location.href = url;
  }

  // open repo type dialog
  openRepoTypeDialog(content) {
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

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../services';
import { environment } from '../../../environments/environment';

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
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

  redirectToExternalLogin(urlText: string) {
    if (!!this.returnUrl && this.returnUrl !== '' && this.returnUrl !== '/') {
      sessionStorage.setItem('ReturnUrl', this.returnUrl);
    }
    window.location.href = this.apiUrl + '/' + urlText;
  }

}

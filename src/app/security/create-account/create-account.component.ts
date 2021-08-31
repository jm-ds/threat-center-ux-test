import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../services';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

    returnUrl: string;
    loading = false;
    error = '';
    model: any = {};
    errorMessage: string;
    apiUrl: string;

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private authenticationService: AuthenticationService,
        private cookieService: CookieService
    ) {
        this.apiUrl = environment.apiUrl;
    }

    ngOnInit() {
        // sessionStorage.setItem('token', '');

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    createAccount() {
        this.loading = true;
        this.authenticationService.createAccount(
            this.model.email,
            this.model.fullName,
            this.model.phone,
            this.model.password,
            this.model.companyName,
            this.model.position,
            this.model.coverLetter,
            this.cookieService.get("invite")
        )
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigateByUrl('/awaiting-approval');
                },
                error => {
                    console.error('CREATE ACCOUNT ERROR', error);
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

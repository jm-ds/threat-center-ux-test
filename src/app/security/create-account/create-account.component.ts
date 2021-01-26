import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../services';

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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private authenticationService: AuthenticationService
    ) {
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
        )
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    console.error('CREATE ACCOUNT ERROR', error);
                    this.error = error;
                    this.loading = false;
                });
    }
}

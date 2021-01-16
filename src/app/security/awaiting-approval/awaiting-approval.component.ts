import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "@app/security/services";
import {Router} from "@angular/router";
import {User} from "@app/models";
import {environment} from "../../../environments/environment";
import {first, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-awaiting-approval',
    templateUrl: './awaiting-approval.component.html',
    styleUrls: ['./awaiting-approval.component.scss']
})
export class AwaitingApprovalComponent implements OnInit {

    user: User;

    loading = false;
    model: any = {};

    messageInfo: string;
    messageError: string;

    constructor(private authenticationService: AuthenticationService,
                private router: Router,
                private http: HttpClient) {
    }



    ngOnInit() {
        this.user = this.authenticationService.currentUser;
        this.model = {
            email: this.user.email,
            orgName: this.user.organization != null && this.user.organization.name != this.user.organization.orgId  ? this.user.organization.name : null,
            coverLetter: this.user.coverLetter,
            phone: this.user.phone,
            position: this.user.position
        };
    }

    updateAccount() {
        this.loading = true;
        // todo: save here...
        console.log("Updating account info...");
        console.log(this.model);

        const url = environment.apiUrl + '/account/update';
        // const body = { email, fullName, phone, password, companyName };
        this.http.post<any>(url, /*body*/ this.model)
            .pipe(map(response => {
                    const user = response.user;
                    console.log("response:");
                    console.log(user);
                    this.loading = false;
                    return user;
                },
                (err) => {
                    console.error('AwaitingApproval component error: ', err);
                    this.loading = false;
                }))
            .pipe(first())
            .subscribe(data => {
                    // this.router.navigate([this.returnUrl]);
                    this.loading = false;
                    this.messageInfo = 'Thank you for providing additional info. Your data saved successfully.';
                    this.authenticationService.loadAuthenticatedUser().then(user => {
                        this.user = user;
                    });
                },
                error => {
                    console.error('CREATE ACCOUNT ERROR', error);
                    // this.error = error;
                    this.loading = false;
                    this.messageInfo = 'Unexpected error occurred while trying to save your data.';
                });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/security/services";
import {environment} from "../../../environments/environment";
import {User} from "@app/models";
import {first} from "rxjs/operators";
import { InviteService } from '@app/services/invite.service';

@Component({
    selector: 'app-finish-signup',
    templateUrl: './finish-signup.component.html',
    styleUrls: ['./finish-signup.component.scss']
})
export class FinishSignupComponent implements OnInit {

    errorMessage: string;
    returnUrl = '/';
    apiUrl: string;
    updateAccountLoading = false;
    dataLoading = true;
    inviteHash = '';
    user: User;

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private authenticationService: AuthenticationService,
        private inviteService: InviteService
    ) {
        this.apiUrl = environment.apiUrl;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.inviteHash = params.invite;
            this.inviteService.getUserByInvite(this.inviteHash).subscribe(
                data => {
                    this.user = data.data.getUserByInvite;
                    this.dataLoading = false;
                },
                error => {
                    console.error("FinishSignupComponent", error);
                    this.errorMessage = error.message;
                }
            );
        });
    }

    redirectToExternalLogin(urlText: string) {
        if (!!this.returnUrl && this.returnUrl !== '' && this.returnUrl !== '/') {
            sessionStorage.setItem('ReturnUrl', this.returnUrl);
        }
        window.location.href = this.apiUrl + '/' + urlText + '?inviteHash=' + this.inviteHash;
    }

    finishCreateAccount() {
        this.updateAccountLoading = true;
        this.inviteService.updateInvitedUser(this.user, this.inviteHash).subscribe(
            data => {
                let result: boolean = data.data.updateInvitedUser;
                console.log("response: " + result);

                this.authenticationService.login(this.user.username, this.user.password)
                    .pipe(first())
                    .subscribe(
                        res => {
                            this.router.navigate([this.returnUrl]);
                        },
                        error => {
                            console.error("LOGIN ERROR", error);
                            // this.error = error;
                            // this.loading = false;
                        });
            },
            error => {
                console.error("FinishSignupComponent", error);
            }
        );
    }
}

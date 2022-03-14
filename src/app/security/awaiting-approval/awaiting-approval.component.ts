import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { first, map } from 'rxjs/operators';

import { User } from '@app/models';

import { environment } from '../../../environments/environment';
import { MESSAGES } from '@app/messages/messages';

import { CommonUIMethodsDecorator } from '@app/core/decorators/common.decorator';

import { AuthenticationService } from '@app/security/services';
import { CoreHelperService } from '@app/services/core/core-helper.service';

@Component({
  selector: 'app-awaiting-approval',
  templateUrl: './awaiting-approval.component.html',
  styleUrls: ['./awaiting-approval.component.scss']
})
@CommonUIMethodsDecorator()
export class AwaitingApprovalComponent implements OnInit {

    user: User;

    loading = false;
    model: any = {};

    messageInfo: string;
    messageError: string;

    constructor(private authenticationService: AuthenticationService,
        private http: HttpClient,
        public coreHelperService: CoreHelperService) {
    }



    ngOnInit() {
        this.user = this.authenticationService.currentUser;
        if(!!this.user){
            this.model = {
                email: this.user.email,
                orgName: this.user.organization != null && this.user.organization.name != this.user.organization.orgId ? this.user.organization.name : null,
                coverLetter: this.user.coverLetter,
                phone: this.user.phone,
                position: this.user.position
            };
        }
    }

  updateAccount() {
    this.loading = true;

    // todo: save here…
    console.log('Updating account info…');
    console.log(this.model);

    const url = environment.apiUrl + '/account/update';
    // const body = { email, fullName, phone, password, companyName };

    this.http
      .post<any>(url, /*body*/ this.model)
      .pipe(
        map(
          response => {
            const user = response.user;

            console.log('response:');
            console.log(user);

            this.loading = false;

            return user;
          },
          (error: HttpErrorResponse) => {
            console.error('AwaitingApproval component error: ', error);

            this.loading = false;
          }
        ),
        first()
      )
      .subscribe(
        () => {
          // this.router.navigate([this.returnUrl]);

          this.loading = false;
          this.messageInfo = MESSAGES.ACCOUNT_UPDATE_SUCCESS;

          this.authenticationService
            .loadAuthenticatedUser()
            .then(user => {
              this.user = user;
            });
        },
        error => {
          console.error('CREATE ACCOUNT ERROR', error);

          // this.error = error;
          this.loading = false;
          this.messageInfo = MESSAGES.ACCOUNT_UPDATE_ERROR;
        });
  }

    logout() {
        this.coreHelperService.logoutUser();
    }
}

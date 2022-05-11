import {Component, OnInit} from "@angular/core";
import {UserUtils} from "@app/admin/user/user-utils";
import {Messages, User} from "@app/models";
import {NavigationExtras, Router} from "@angular/router";
import {AuthenticationService, LoginType} from "@app/security/services";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'user-accounts',
    templateUrl: './user-accounts.component.html',
    styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent extends UserUtils implements OnInit {

    messages: Messages;
    currentUser: User;

    constructor(
      private authenticationService: AuthenticationService,
      protected router: Router)
    {
      super(router);
      this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
      this.currentUser = this.authenticationService.currentUser;

    }

    addAccount(accountType:string) {
        let jwt = this.authenticationService.getFromSessionStorageBasedEnv('jwt');

        if (jwt) {
            console.log(`about to attach  ${accountType} to current user`);
            console.log(`jwt is ${jwt}`);
            const loginType = accountType.toLowerCase() as LoginType;
            const url = environment.apiUrl + '/' + this.authenticationService.loginTypeToLoginUrl(loginType) + '?joinUser=true&jwt=' + jwt;
            window.location.href = url;
        } else {
            console.error('could not find jwt');
        }
    }

    backToUser() {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": this.currentUser.username
            }
        };
        this.router.navigate(['/admin/user/show'], navigationExtras);
    }

    hasGitlab() {
      return !!this.currentUser.repositoryAccounts.gitlabAccount;
    }

    hasGithub() {
        return !!this.currentUser.repositoryAccounts.githubAccount;
    }



}

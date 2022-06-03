import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { AuthenticationService, LoginType } from '@app/security/services';

import { Messages } from '@app/models';

import { UserUtils } from '@app/admin/user/user-utils';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent extends UserUtils {
  messages: Messages;

  constructor(protected router: Router, private authenticationService: AuthenticationService) {
    super(router);

    this.messages = Messages.fromRouter(this.router);
  }

  addAccount(accountType: string) {
    const jwt = this.authenticationService.getFromSessionStorageBasedEnv('jwt');

    if (jwt) {
      console.log(`about to attach  ${accountType} to current user`);
      console.log(`jwt is ${jwt} `);
      const loginType = accountType.toLowerCase() as LoginType;
      let url = environment.apiUrl + '/rest/auth/' + this.authenticationService.loginTypeToLoginUrl(loginType) + '?joinUser=true&jwt=' + jwt;
      if (loginType === LoginType.GITHUB) {
        url = url + '&needPrivateRepos=true';
      }
      window.location.href = url;
    } else {
      console.error('could not find jwt');
    }
  }

  backToUser() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        userName: this.authenticationService.currentUser.username
      }
    };
    this.router.navigate(['/admin/user/show'], navigationExtras);
  }

  hasGitlab() {
    return this.authenticationService.currentUser.repositoryAccounts.gitlabAccount;
  }

  hasGithub() {
    return !!this.authenticationService.currentUser.repositoryAccounts.githubAccount;
  }

  get currentUser() {
    return this.authenticationService.currentUser;
  }
}

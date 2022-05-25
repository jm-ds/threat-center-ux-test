import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { AuthenticationService } from '../services';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteService } from '@app/services/invite.service';
import { AccountService } from '@app/security/services/account.service';

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
    inviteHash: string;
    choosenRepoType: string = 'private';

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private authenticationService: AuthenticationService,
        private accountService: AccountService,
        private cookieService: CookieService,
        private inviteService: InviteService,
        private modalService: NgbModal
    ) {
        this.apiUrl = environment.apiUrl;
    }

    ngOnInit() {
        // sessionStorage.setItem('token', '');

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.inviteHash = this.cookieService.get("invite");
        if (!!this.inviteHash) {
            this.inviteService.getOrgDataByInvite(this.inviteHash).subscribe(
                res => {
                    this.model.companyName = res.data.inviteOrg.name;
                },
                error => {
                    console.error('GET ORG DATA ERROR', error);
                }
            )
        }
    }

    createAccount() {
      this.loading = true;

      const { email, fullName, phone, password, companyName,  position, coverLetter } = this.model;

      this.accountService.createAccount(email, fullName, phone, password, companyName,  position, coverLetter, this.inviteHash)
        .pipe(
          first()
        )
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/awaiting-approval');
          },
          error: error => {
            console.error('CREATE ACCOUNT ERROR', error);

            this.error = error;
            this.loading = false;
          }
        });
    }

  // login via external oauth
  externalLogin(urlText: string, repoTypeDialog) {
    let param = undefined;
    if (urlText === 'github_login') {
      let repotype = this.authenticationService.getGitHubRepoType();
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
    this.redirectToExternalLogin(this.apiUrl + '/' + urlText + (!!param? '?'+param: ''))
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
    let param = undefined;
    if (this.choosenRepoType === 'private') {
      param = 'needPrivateRepos=true';
    }
    this.redirectToExternalLogin(this.apiUrl + '/github_login' + (!!param? '?'+param: ''))
  }

}

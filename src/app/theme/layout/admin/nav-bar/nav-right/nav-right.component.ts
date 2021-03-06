import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CommonUIMethodsDecorator } from '@app/core/decorators/common.decorator';
import { CoreHelperService } from '@app/services/core/core-helper.service';
import { User } from '@app/models';
import { AuthenticationService } from '@app/security/services';
import { InviteService } from '@app/services/invite.service';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})

@CommonUIMethodsDecorator()

export class NavRightComponent implements OnInit {

  inviteUrl: string;

  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public coreHelperService: CoreHelperService,
    private inviteService: InviteService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;
  }

  logout() {
    this.coreHelperService.logoutUser();
  }

  inviteUser(inviteUrlDialog) {
    this.inviteService.createInvite().subscribe(
      data => {
        const inviteHash = data.data.createInvite.inviteHash;

        this.router.navigate(['/admin/invite', inviteHash]);
      },
      error => {
        console.error("NavRightComponent", error);
      }
    );
  }

  gotoProfile() {
    //Navigate to user detail page
    if (!!this.authenticationService.currentUser && !!this.authenticationService.currentUser['username']) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          "userName": this.authenticationService.currentUser['username']
        }
      };
      this.router.navigate(['/admin/user/show'], navigationExtras);
    }
  }

}

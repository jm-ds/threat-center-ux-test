import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InviteService } from '@app/admin/services/invite.service';
import { CommonUIMethodsDecorator } from '@app/core/decorators/common.decorator';
import { CoreHelperService } from '@app/core/services/core-helper.service';
import { AuthenticationService } from '@app/security/services';
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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public coreHelperService: CoreHelperService,
    private inviteService: InviteService) { }

  ngOnInit() { }

  logout() {
    this.coreHelperService.logoutUser();
  }

  inviteUser(inviteUrlDialog) {
    this.inviteService.createInvite().subscribe(
      data => {
          let inviteHash = data.data.createInvite.inviteHash;
          const link = '/admin/invite/show/'+ inviteHash;
                this.router.navigate([link]);
      },
      error => {
          console.error("NavRightComponent", error);
      }
  );
  }

}

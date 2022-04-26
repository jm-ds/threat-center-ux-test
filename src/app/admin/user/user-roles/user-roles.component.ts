import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Role, User, Message } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { UserUtils } from '@app/admin/user/user-utils';

import { UserService } from '@app/services/user.service';
import { RoleService } from '@app/services/role.service';

import { DualListComponent } from 'angular-dual-listbox';

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
    styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent extends UserUtils implements OnInit {
    keepSorted = true;
    source: Array<any>;
    confirmed: Array<any> = [];
    key: string;
    display: any;
    filter = false;
    format: any = DualListComponent.DEFAULT_FORMAT;
    disabled = false;

    user: User;
    roles: Role[];

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private route: ActivatedRoute,
        protected router: Router
    ) {
        super(router);
    }

    ngOnInit() {
        const username = this.route.snapshot.paramMap.get('username');
        this.userService.getUser(username).subscribe(
            data => {
                this.user = data.data.user;
                this.confirmed = this.user.userRoles;
                this.getRoleList();
            },
            error => {
                console.error("UserRolesComponent", error);
            }
        );

        this.key = 'roleId';
        this.display = this.roleDisplay;
    }

    private getRoleList() {
        this.roleService.getRoleList().subscribe(
            data => {
                this.roles = data.data.roles;
                this.source = data.data.roles.filter(role => !this.confirmed.includes(role));
            },
            error => {
                console.error("UserRolesComponent", error);
            }
        );
    }

    private roleDisplay(item: any) {
        return item.roleId + ' - ' + item.description;
    }

  public saveRoles() {
    this.userService
      .saveRoles(this.user.username, this.confirmed)
      .subscribe(
        () => {
          const navigationExtras: NavigationExtras = {
            state: {
              messages: [Message.success(MESSAGES.ROLES_SAVE_SUCCESS)]
            },
            queryParams: {
              userName: this.user.username
            }
          };

          this.router.navigate(['/admin/user/show'], navigationExtras);
        },
        error => {
          console.error('User roles saving', error);

          const navigationExtras: NavigationExtras = {
            state: {
              messages: [Message.error(MESSAGES.ROLES_SAVE_ERROR)]
            },
            queryParams: {
              userName: this.user.username
            }
          };
        });
  }

    gotoUser(userName) {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                "userName": userName
            }
        };
        this.router.navigate(['/admin/user/show'], navigationExtras);
    }

}

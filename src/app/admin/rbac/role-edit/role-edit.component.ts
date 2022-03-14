import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Message, Messages, Role } from '@app/models';

import { MESSAGES } from '@app/messages/messages';

import { RoleService } from '@app/services/role.service';

import { DualListComponent } from 'angular-dual-listbox';

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit, OnDestroy {

    newRole = true;
    role: Role;
    messages: Messages;
    display: any;
    format: any = DualListComponent.DEFAULT_FORMAT;
    source: Array<any>;
    confirmed: Array<any>;

    mySubscription: any;

    constructor(
        private roleService: RoleService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);

        // tslint:disable-next-line:only-arrow-functions
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };

        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.mySubscription) {
            this.mySubscription.unsubscribe();
        }
    }

    ngOnInit() {
        const roleId = this.route.snapshot.paramMap.get('roleId');

        if (roleId !== null && roleId !== undefined) {
            this.roleService.getRole(roleId).subscribe(
                data => {
                    this.role = data.data.role;
                    this.confirmed = this.role.rolePermissions;
                    this.newRole = false;
                },
                error => {
                    console.error("RoleEditComponent", error);
                }
            );
        }
        else {
            this.newRole = true;
            this.role = new Role();
            this.confirmed = [];
        }

        this.roleService.getPermissionList().subscribe(
            data => {
                this.source = data.data.permissions.filter(permission => !this.confirmed.includes(permission));
            },
            error => {
                console.error("RoleEditComponent", error);
            }
        );

        this.display = this.permissionDisplay;
    }


    private permissionDisplay(item: any) {
        return item.title + ' - ' + item.description;
    }


    saveRole() {
      this.roleService
        .saveRole(this.role, this.confirmed, this.newRole)
        .subscribe(
          () => {
            this.router.navigate(['/admin/role/show/', this.role.roleId], {
              state: {
                messages: [Message.success(MESSAGES.ROLE_SAVE_SUCCESS)]
              }
            });
          },
          error => {
            console.error('Role Saving', error);

            const path = this.newRole ? '/admin/role/list' : `/admin/role/show/${this.role.roleId}`;

            this.router.navigate([path], {
              state: {
                messages: [Message.error(MESSAGES.ROLE_SAVE_ERROR)]
              }
            });
          });
    }
}

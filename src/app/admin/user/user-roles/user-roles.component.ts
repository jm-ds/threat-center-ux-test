import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserUtils } from "@app/admin/user/user-utils";
import { ActivatedRoute, Router } from "@angular/router";
import { Role, User, Message } from "@app/models";
import { DualListComponent } from "angular-dual-listbox";
import { UserService } from '@app/services/user.service';
import { RoleService } from '@app/services/role.service';

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
    styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent extends UserUtils implements OnInit, OnDestroy {

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

    private saveRoles() {
        this.userService.saveRoles(this.user.username, this.confirmed)
            .subscribe(({ data }) => {
                this.router.navigate(['/admin/user/show/' + this.user.username],
                    { state: { messages: [Message.success("Roles added successfully.")] } });
            }, (error) => {
                console.error('User Roles Saving', error);
                this.router.navigate(['/admin/user/show/' + this.user.username],
                    { state: { messages: [Message.error("Unexpected error occurred while trying to add roles.")] } });
            });
    }

    ngOnDestroy(): void {
    }

}

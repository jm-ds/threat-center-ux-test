import {Component, OnInit} from '@angular/core';
import {Message, Messages, Role} from "@app/models";
import {ActivatedRoute, Router} from "@angular/router";
import {RoleService} from "@app/admin/services/role.service";

@Component({
    selector: 'app-role-view',
    templateUrl: './role-show.component.html',
    styleUrls: ['./role-show.component.scss']
})
export class RoleShowComponent implements OnInit {

    role: Role;
    messages: Messages;

    constructor(
        private roleService: RoleService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        const roleId = this.route.snapshot.paramMap.get('roleId');
        this.roleService.getRole(roleId).subscribe(
            data => {
                this.role = data.data.role;
            },
            error => {
                console.error("RoleShowComponent", error);
            }
        );
    }

    removeRole() {
        if (confirm("Are you sure you want to delete the role " + this.role.roleId + "?")) {
            this.roleService.removeRole(this.role)
                .subscribe(({data}) => {
                    this.router.navigate(['/admin/role/list'],
                        {state: {messages: [Message.success("Role removed successfully.")]}});
                }, (error) => {
                    console.error('Role Removing', error);
                    this.router.navigate(['/admin/role/show/' + this.role.roleId],
                        {state: {messages: [Message.error("Unexpected error occurred while trying to remove role.")]}});
                });
        }
    }

}

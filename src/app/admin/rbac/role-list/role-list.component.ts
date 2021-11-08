import {Component, OnInit} from '@angular/core';
import {Messages, Role} from "@app/models";
import {Router} from "@angular/router";
import { RoleService } from '@app/services/role.service';


@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

    roles: Role[];
    messages: Messages;

    constructor(
        private roleService: RoleService,
        protected router: Router,
    ) {
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        this.roleService.getRoleList().subscribe(
            data => {
                this.roles = data.data.roles;
            },
            error => {
                console.error("RoleListComponent", error);
            }
        );
    }

}

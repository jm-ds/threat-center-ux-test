import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from "@app/models";

import {Router} from '@angular/router';
import {UserUtils} from "@app/admin/user/user-utils";
import { AuthorizationService } from '@app/security/services';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserListComponent extends UserUtils implements OnInit {

    users: User[];

    constructor(
        private userService: UserService,
        protected router: Router,
        public authorizationService: AuthorizationService
    ) {
        super(router);
    }

    ngOnInit() {
        this.userService.getUserList().subscribe(
            data => {
                this.users = data.data.users.edges.map((e)=>e.node);
            },
            error => {
                console.error("UserListComponent", error);
            }
        );
    }
}

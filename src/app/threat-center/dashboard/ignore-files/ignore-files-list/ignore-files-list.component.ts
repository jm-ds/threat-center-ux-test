import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {User} from "@app/models";

import {Router} from '@angular/router';
import {UserUtils} from "@app/admin/user/user-utils";
import { AuthorizationService } from '@app/security/services';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-ignore-files-list',
    templateUrl: './ignore-files-list.component.html',
    styleUrls: ['./ignore-files-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IgnoreFilesListComponent extends UserUtils implements OnInit {

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

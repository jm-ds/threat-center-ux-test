import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from "@app/admin/services/user.service";
import {User, Role} from "@app/models";
import {Entity} from "@app/threat-center/shared/models/types";
import {ActivatedRoute, Router} from '@angular/router';
import {UserUtils} from "@app/admin/user/user-utils";

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
    ) {
        super(router);
    }

    ngOnInit() {
        // this.users = this.userService.getUserList().pipe(map(result => result.data.users));
        this.userService.getUserList().subscribe(
            data => {
                this.users = data.data.users;
            },
            error => {
                console.error("UserListComponent", error);
            }
        );
    }
}

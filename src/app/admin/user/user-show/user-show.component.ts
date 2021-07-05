import {Component, OnInit} from '@angular/core';
import {Messages, User} from "@app/models";
import {UserService} from "@app/admin/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtils} from "@app/admin/user/user-utils";

@Component({
    selector: 'app-user',
    templateUrl: './user-show.component.html',
    styleUrls: ['./user-show.component.scss']
})
export class UserShowComponent extends UserUtils implements OnInit {

    user: User;
    messages: Messages;


    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        const username = this.route.snapshot.paramMap.get('username');
        this.userService.getUser(username).subscribe(
            data => {
                this.user = data.data.user;
            },
            error => {
                console.error("UserShowComponent", error);
            }
        );
    }

}

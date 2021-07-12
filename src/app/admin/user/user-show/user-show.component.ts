import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Messages, User} from "@app/models";
import {UserService} from "@app/admin/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtils} from "@app/admin/user/user-utils";
import { AuthenticationService } from '@app/security/services';

@Component({
    selector: 'app-user',
    templateUrl: './user-show.component.html',
    styleUrls: ['./user-show.component.scss']
})
export class UserShowComponent extends UserUtils implements OnInit {

    user: User;
    messages: Messages;
    organizationDetails:{orgId:string,name:string,tenantId:string,created:string};

    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        const user = this.authService.getFromSessionStorageBasedEnv("currentUser");
        if(!!user){
            this.organizationDetails = user['organization'];
        }
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

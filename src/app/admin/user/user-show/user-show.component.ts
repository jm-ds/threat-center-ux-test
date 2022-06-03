import { Component, OnInit } from '@angular/core';
import { Messages, User } from "@app/models";
import { ActivatedRoute, Router } from "@angular/router";
import { UserUtils } from "@app/admin/user/user-utils";
import { AuthenticationService, AuthorizationService } from '@app/security/services';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user-show.component.html',
    styleUrls: ['./user-show.component.scss']
})
export class UserShowComponent extends UserUtils implements OnInit {

    user: User;
    messages: Messages;
    organizationDetails: { orgId: string, name: string, tenantId: string, created: string };

    constructor(
        private userService: UserService,
        protected router: Router,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        public authorizationService: AuthorizationService
    ) {
        super(router);
        this.messages = Messages.fromRouter(this.router);
    }

    ngOnInit() {
        // this.route.params.subscribe(params=>{
        //     this.init();
        // });
        this.route.queryParams.subscribe(params => {
            const userName = params["userName"];
            this.init(userName);
        });
    }


    // initialize user data
    init(username) {
        const user = this.authService.currentUser;
        if (!!user) {
            this.organizationDetails = user['organization'];
        }
        // const username = this.route.snapshot.paramMap.get('username');
        this.userService.getUser(username).subscribe(
            data => {
                this.user = data.data.user;
            },
            error => {
                console.error("UserShowComponent", error);
            }
        );
    }

  get currentUser() {
    return this.authService.currentUser;
  }
}

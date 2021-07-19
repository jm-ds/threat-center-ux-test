import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {UserUtils} from "@app/admin/user/user-utils";
import {Router} from "@angular/router";
import {User} from "@app/models";

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserCardComponent extends UserUtils implements OnInit {

    @Input() user: User;
    @Input() organizationDetails:{orgId:string,name:string,tenantId:string,created:string};
    @Input() showMenu: boolean;

    constructor(
        protected router: Router
    ) {
        super(router);
    }

    ngOnInit() { }

}

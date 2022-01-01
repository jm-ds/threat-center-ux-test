import { Component, OnInit } from "@angular/core";
import { User } from "@app/models";
import { AuthenticationService } from "@app/security/services";
import { EntityManagerService } from "@app/services/entity-manage.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-general-setting',
    templateUrl: './general-setting.component.html',
    styleUrls: ['./general-setting.component.scss']
})


export class GeneralSettingComponent implements OnInit {

    organizationInfo: { orgId: string, name: string } = { orgId: '', name: '' };
    constructor(private authService: AuthenticationService,
        private entityService: EntityManagerService,
        private toastr: ToastrService) { }
    ngOnInit(): void {
        if (!!this.authService.currentUser.organization) {
            this.organizationInfo.orgId = this.authService.currentUser.organization.orgId;
            this.organizationInfo.name = this.authService.currentUser.organization.name === this.authService.currentUser.organization.orgId ? 'PoC Company' :
                this.authService.currentUser.organization.name;
        }
    }

    // Update Organization Name
    saveOrgName() {
        // Save Organization name
        this.entityService.updateOrganizationName(this.organizationInfo)
            .subscribe((data: any) => {
                if (!!data && !!data.data && !!data.data.updateOrgName) {
                    this.toastr.success("Organization updated successfully.");
                    let user: User = this.authService.getFromSessionStorageBasedEnv('currentUser');
                    if (!!user) {
                        if (!!user.organization) {
                            user.organization.name = this.organizationInfo.name;
                            this.authService.setInSessionStorageBasedEnv('currentUser', user);
                            this.authService.currentUserSubject.next(user);
                        }
                    }
                }
            });
    }
}
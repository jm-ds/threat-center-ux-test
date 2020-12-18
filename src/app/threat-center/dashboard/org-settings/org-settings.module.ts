import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSharedModule } from '../../../theme/shared/theme-shared.module';
import { TcSharedModule } from "@app/threat-center/shared/tc-shared.module";
import { FormsModule } from "@angular/forms";
import { AlertModule } from "@app/theme/shared/components";
import { SharedModule } from '@app/shared/shared.module';
import { CardModule } from "@app/theme/shared/components";
import { TableModule } from 'primeng/table';
import { OrganizationSettingRoutingModule } from './org-settings-routing.module';
import { OrganizationSettingComponent } from './setting/org-setting.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardModule } from '../dashboard.module';

@NgModule({
    declarations: [OrganizationSettingComponent],
    imports: [
        CommonModule,
        SharedModule,
        TcSharedModule,
        CardModule,
        FormsModule,
        AlertModule,
        ThemeSharedModule,
        TableModule,
        NgbTabsetModule,
        OrganizationSettingRoutingModule,
        DashboardModule
    ]
})

export class OrganizationSettingModule { }

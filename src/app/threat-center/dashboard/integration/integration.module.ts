import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {TcSharedModule} from "@app/threat-center/shared/tc-shared.module";
import {AngularDualListBoxModule} from "angular-dual-listbox";
import {FormsModule} from "@angular/forms";
import {AlertModule} from "@app/theme/shared/components";
import {NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared/shared.module';
import {CardModule} from "@app/theme/shared/components";
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MatChipsModule} from '@angular/material/chips';
import { TreeTableModule } from 'primeng/treetable';
import { AlertEmailsComponent } from './alert-emails/alert-emails.component';
import { SlackUrlsComponent } from './slack-urls/slack-urls.component';
import { JiraCredentialsComponent } from './jira-credentials/jira-credentials.component';
import { OrgApiKeysComponent } from './org-apikeys/org-apikeys-list.component';
import { RouterModule } from '@angular/router';
import { GeneralSettingComponent } from './general-setting/general-setting.component';


@NgModule({
  declarations: [AlertEmailsComponent, SlackUrlsComponent, JiraCredentialsComponent, OrgApiKeysComponent, GeneralSettingComponent],
    imports: [
        CommonModule,
        SharedModule,
        TcSharedModule,
        CardModule,
        AngularDualListBoxModule,
        FormsModule,
        AlertModule,
        NgbTabsetModule,
        ThemeSharedModule,
        TableModule,
        DropdownModule,
        MatChipsModule,
        TreeTableModule,
        RouterModule
    ],
    exports: [AlertEmailsComponent, SlackUrlsComponent, JiraCredentialsComponent, OrgApiKeysComponent, GeneralSettingComponent]
})
export class IntegrationModule { }

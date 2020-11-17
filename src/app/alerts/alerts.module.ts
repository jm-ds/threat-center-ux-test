import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertsSettingsComponent } from './alerts-settings/alerts-settings.component';
import {CardModule} from "@app/theme/shared/components";
import { AlertTypeSettingsComponent } from './alert-type-settings/alert-type-settings.component';
import {ReportsModule} from "@app/reports/reports.module";
import {FormsModule} from "@angular/forms";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [AlertsComponent, AlertsSettingsComponent, AlertTypeSettingsComponent],
    imports: [
        CommonModule,
        AlertsRoutingModule,
        CardModule,
        ReportsModule,
        FormsModule,
        NgbDropdownModule
    ]
})
export class AlertsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSharedModule } from '../../../theme/shared/theme-shared.module';
import { TcSharedModule } from "@app/threat-center/shared/tc-shared.module";
import { FormsModule } from "@angular/forms";
import { AlertModule } from "@app/theme/shared/components";
import { SharedModule } from '@app/shared/shared.module';
import { CardModule } from "@app/theme/shared/components";
import { TableModule } from 'primeng/table';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { EntitySettingRoutingModule } from './entity-settings-routing.module';
import { EntitySettingsComponent } from './setting/entity-settings.component';

@NgModule({
    declarations: [EntitySettingsComponent],
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
        EntitySettingRoutingModule
    ]
})

export class EntitySettingModule { }

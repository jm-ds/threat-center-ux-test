import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPopoverModule, NgbProgressbarModule,NgbTabsetModule,NgbDropdownModule,NgbButtonsModule,NgbTooltipModule,NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared/shared.module';
import {TableModule} from 'primeng/table';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import {VulnerabilitiesComponent,VulnerabilityDetailComponent} from './vulnerability';
import {ComponentsComponent, ComponentDetailComponent} from './component';
import {ScansComponent} from './scans/scans.component';
import {LicensesComponent,LicenseDetailComponent} from './license';
import {ScanAssetsComponent,ScanAssetDetailComponent} from './scanasset';
import {TcSharedModule} from '@app/threat-center/shared/tc-shared.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    SharedModule,
    TableModule,
    TcSharedModule,
    MarkdownModule
  ],
  declarations: [
    ProjectComponent,
    VulnerabilitiesComponent,
    VulnerabilityDetailComponent,
    ComponentsComponent,
    ComponentDetailComponent,
    ScansComponent,
    LicensesComponent,
    LicenseDetailComponent,
    ScanAssetsComponent,
    ScanAssetDetailComponent
  ]
})
export class ProjectModule { }

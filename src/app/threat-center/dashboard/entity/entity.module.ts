import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { ThemeSharedModule } from '../../../theme/shared/theme-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPopoverModule, NgbProgressbarModule, NgbTabsetModule, NgbDropdownModule, NgbButtonsModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeTableModule } from 'primeng/treetable';
import { NgApexchartsModule } from "ng-apexcharts";
import { OrganizationChartModule } from 'primeng/organizationchart';
@NgModule({
  imports: [
    CommonModule,
    EntityRoutingModule,
    ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    TableModule,
    NgxDatatableModule,
    TreeTableModule,
    NgApexchartsModule,
    NgbModule,
    OrganizationChartModule
  ],
  declarations: [
    EntityComponent
  ]
})
export class EntityModule { }

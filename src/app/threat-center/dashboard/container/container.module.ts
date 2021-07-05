import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerRoutingModule } from './container-routing.module';
import { ContainerComponent } from './container.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPopoverModule, NgbProgressbarModule,NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgbButtonsModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { TcSharedModule } from '../../shared/tc-shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContainerRoutingModule,
   ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbTabsetModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    TcSharedModule
  ],
  declarations: [
    ContainerComponent,
  ]
})
export class ContainerModule { }

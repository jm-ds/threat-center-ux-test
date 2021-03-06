import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSharedModule } from '../../theme/shared/theme-shared.module';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { NgbPopoverModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { SourceDimensionComponent } from './source-dimension/source-dimension.component';
import { LicenseDimensionComponent } from './license-dimension/license-dimension.component';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '@app/shared/shared.module';
import { TaskComponent } from './task/task.component';
import { MessagesComponent } from './messages/messages.component';
import { SimmComponent } from './simm/simm.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  imports: [
    CommonModule,
    ThemeSharedModule,
    SharedModule,
    TableModule,
    RouterModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbTabsetModule,
    MatPaginatorModule,
    MarkdownModule.forRoot()
  ],
  exports: [
    SourceDimensionComponent,
    LicenseDimensionComponent,
    TaskComponent,
    MessagesComponent,
    SimmComponent
  ],
  declarations: [
    SourceDimensionComponent,
    LicenseDimensionComponent,
    TaskComponent,
    MessagesComponent,
    SimmComponent
  ]
})
export class TcSharedModule { }

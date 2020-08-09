import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbPagingRoutingModule } from './breadcrumb-paging-routing.module';
import { BreadcrumbPagingComponent } from './breadcrumb-paging.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {NgbButtonsModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbPagingRoutingModule,
   ThemeSharedModule,
    NgbButtonsModule,
    NgbPaginationModule
  ],
  declarations: [BreadcrumbPagingComponent]
})
export class BreadcrumbPagingModule { }

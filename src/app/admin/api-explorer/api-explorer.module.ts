import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiExplorerRoutingModule } from './api-explorer-routing.module';
import { ApiExplorerComponent } from './api-explorer.component';

@NgModule({
  declarations: [ApiExplorerComponent],
  imports: [
    CommonModule,
    ApiExplorerRoutingModule
  ]
})
export class ApiExplorerModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiExplorerComponent } from './api-explorer.component';

const routes: Routes = [
  {
    path: '',
    component: ApiExplorerComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ApiExplorerRoutingModule { }

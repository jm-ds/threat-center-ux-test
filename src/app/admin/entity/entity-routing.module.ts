import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetDefaultEntityResolver } from '../services/entity.service';
import { EntityManageComponent } from './entity-manage/entity-manage.component';


const routes: Routes = [
  {
    path: '',
    component: EntityManageComponent,
    resolve: {
      defaultEntityDetails: GetDefaultEntityResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }

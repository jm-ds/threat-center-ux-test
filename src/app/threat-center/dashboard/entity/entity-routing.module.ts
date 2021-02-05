import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/security/helpers/auth.guard';
import { EntityComponent } from './entity.component';

const routes: Routes = [
  {
    path: ':entityId',
    component: EntityComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: '',
    component: EntityComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }

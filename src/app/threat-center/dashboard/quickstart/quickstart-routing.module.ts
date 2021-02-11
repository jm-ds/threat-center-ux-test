import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/security/helpers/auth.guard';
import { QuickstartWizardComponent} from './wizard/quickstart-wizard.component';

const routes: Routes = [
  {
   path: ':entityId',
    component: QuickstartWizardComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: '',
    component: QuickstartWizardComponent,
    canDeactivate: [CanDeactivateGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickstartRoutingModule { }

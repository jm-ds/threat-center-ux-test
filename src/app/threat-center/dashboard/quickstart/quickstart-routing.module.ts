import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickstartWizardComponent} from './wizard/quickstart-wizard.component';

const routes: Routes = [
  {
   path: ':entityId',
    component: QuickstartWizardComponent
  },
  {
    path: '',
    component: QuickstartWizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickstartRoutingModule { }

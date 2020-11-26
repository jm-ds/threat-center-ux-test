import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'legal',
        loadChildren: () => import('./legal/legal.module').then(module => module.LegalModule)
      },
      {
        path: 'entity',
        loadChildren: () => import('./entity/entity.module').then(module => module.EntityModule)
      },
      {
        path: 'entity/:entityId/project/:projectId',
        loadChildren: () => import('./project/project.module').then(module => module.ProjectModule)
      },
      {
        path: 'container',
        loadChildren: () => import('./container/container.module').then(module => module.ContainerModule)
      },
      {
        path: 'scan',
        loadChildren: () => import('./quickstart/quickstart.module').then(module => module.QuickstartModule)
      },
      {
        path: 'policy',
        loadChildren: () => import('./policy/policy.module').then(module => module.PolicyModule)
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/security/helpers';

const routes: Routes = [
  {
    path: '',
    data: { auth: "AUTHENTICATED" },
    children: [
      {
        path: 'legal',
        canActivate: [AuthGuard],
        loadChildren: () => import('./legal/legal.module').then(module => module.LegalModule)
      },
      {
        path: 'entity',
        canActivate: [AuthGuard],
        loadChildren: () => import('./entity/entity.module').then(module => module.EntityModule)
      },
      {
        path: 'entity/:entityId/project/:projectId',
        canActivate: [AuthGuard],
        loadChildren: () => import('./project/project.module').then(module => module.ProjectModule)
      },
      {
        path: 'scan',
        canActivate: [AuthGuard],
        loadChildren: () => import('./quickstart/quickstart.module').then(module => module.QuickstartModule)
      },
      {
        path: 'policy',
        canActivate: [AuthGuard],
        loadChildren: () => import('./policy/policy.module').then(module => module.PolicyModule)
      },
      {
        path: 'org-setting',
        canActivate: [AuthGuard],
        loadChildren: () => import('./org-settings/org-settings.module').then(module => module.OrganizationSettingModule)
      },
      {
        path: 'entity-setting/:entityId',
        canActivate: [AuthGuard],
        loadChildren: () => import('./entity-settings/entity-settings.module').then(module => module.EntitySettingModule)
      },
      {
        path: 'project-setting',
        canActivate: [AuthGuard],
        loadChildren: () => import('./project-settings/project-settings.module').then(module => module.ProjectSettingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

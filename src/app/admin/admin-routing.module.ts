import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/security/helpers';


const routes: Routes = [
  {
    path: '',
    data: { auth: "AUTHENTICATED" },
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () => import('./user/user.module').then(module => module.UserModule)
      },
      {
        path: 'role',
        canActivate: [AuthGuard],
        loadChildren: () => import('./rbac/rbac.module').then(module => module.RbacModule)
      },
      {
        path: 'entity',
        canActivate: [AuthGuard],
        loadChildren: () => import('./entity/entity.module').then(module => module.EntityModule)
      },
      {
        path: 'deployment',
        canActivate: [AuthGuard],
        loadChildren: () => import('./deployment/deployment.module')
          .then(module => module.DeploymentModule)
      },
      {
        path: 'api-explorer',
        loadChildren: () => import('./api-explorer/api-explorer.module')
          .then(m => m.ApiExplorerModule)
      },
      {
        path: 'integration',
        canActivate: [AuthGuard],
        loadChildren: () => import('./integration/integration.module').then(module => module.IntegrationModule)
      },
      {
        path: 'invite',
        canActivate: [AuthGuard],
        loadChildren: () => import('./invite/invite.module').then(module => module.InviteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

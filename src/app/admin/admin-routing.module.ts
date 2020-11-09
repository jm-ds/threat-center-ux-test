import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(module => module.UserModule)
      },
      {
        path: 'role',
        loadChildren: () => import('./rbac/rbac.module').then(module => module.RbacModule)
      },
      {
        path: 'entity',
        loadChildren: () => import('./entity/entity.module').then(module => module.EntityModule)
      },
      {
        path: 'integration',
        loadChildren: () => import('./integration/integration.module').then(module => module.IntegrationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

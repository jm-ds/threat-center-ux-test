import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AuthGuard } from './security/helpers';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { auth: "AUTHENTICATED" },
    children: [
      {
        path: '',
        redirectTo: 'dashboard/entity',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./threat-center/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule)
      },
      {
        path: 'alerts',
        loadChildren: () => import('./alerts/alerts.module').then(module => module.AlertsModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./security/security.module').then(module => module.SecurityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

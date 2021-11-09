import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ComponentDetailComponent } from './component';
import { VulnerabilityDetailComponent } from './vulnerability';
import { LicenseDetailComponent } from './license';
import { ScanAssetDetailComponent } from './scanasset';
import { CanDeactivateGuard } from '@app/security/helpers/auth.guard';
import { GetProjectData, ProjectDashboardResolver } from '@app/services/project-dashboard.service';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProjectComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          project: GetProjectData,
          otherComponentData: ProjectDashboardResolver
        }
      },
      {
        path: 'component/:componentId',
        component: ComponentDetailComponent
      },
      {
        path: 'scan/:scanId/component/:componentId',
        component: ComponentDetailComponent
      },
      {
        path: 'scan/:scanId/license/:licenseId/component/:componentId',
        component: ComponentDetailComponent
      },
      {
        path: 'vulnerability/:vulnerabilityId',
        component: VulnerabilityDetailComponent
      },
      {
        path: 'scan/:scanId/vulnerability/:vulnerabilityId',
        component: VulnerabilityDetailComponent
      },
      {
        path: 'license/:licenseId',
        component: LicenseDetailComponent
      },
      {
        path: 'scan/:scanId/license/:licenseId/discovery/:licenseDiscovery/origin/:licenseOrigin',
        component: LicenseDetailComponent
      },
      {
        path: 'scanasset/:scanId/:scanAssetId',
        component: ScanAssetDetailComponent
      },
      {
        path: 'scan/:scanId/scanasset/:scanAssetId',
        component: ScanAssetDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }

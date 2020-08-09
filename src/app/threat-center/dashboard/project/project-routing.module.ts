import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectComponent} from './project.component';
import {ComponentDetailComponent} from './component';
import {VulnerabilityDetailComponent} from './vulnerability';
import {LicenseDetailComponent} from './license';
import {ScanAssetDetailComponent} from './scanasset';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':projectId',
        component: ProjectComponent
      },
      {
       path: 'component/:componentId',
       component: ComponentDetailComponent
      },
      {
       path: 'vulnerability/:vulnerabilityId',
       component: VulnerabilityDetailComponent
      },
      {
       path: 'license/:licenseId',
       component: LicenseDetailComponent
      },
      {
       path: 'scanasset/:scanId/:scanAssetId',
       component: ScanAssetDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }

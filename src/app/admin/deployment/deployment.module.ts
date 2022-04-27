import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeploymentRoutingModule } from './deployment-routing.module';
import { DeploymentComponent } from './deployment.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeploymentComponent],
  imports: [
    CommonModule,
    DeploymentRoutingModule,
    FormsModule
  ]
})
export class DeploymentModule { }

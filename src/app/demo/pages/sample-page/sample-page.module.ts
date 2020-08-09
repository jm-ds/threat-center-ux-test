import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SamplePageRoutingModule } from './sample-page-routing.module';
import { SamplePageComponent } from './sample-page.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [SamplePageComponent],
  imports: [
    CommonModule,
    SamplePageRoutingModule,
   ThemeSharedModule,
  ]
})
export class SamplePageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvLightBoxComponent } from './adv-light-box.component';
import { AdvLightBoxRoutingModule } from './adv-light-box-routing.module';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  imports: [
    CommonModule,
    AdvLightBoxRoutingModule,
   ThemeSharedModule,
    LightboxModule
  ],
  declarations: [AdvLightBoxComponent]
})
export class AdvLightBoxModule { }

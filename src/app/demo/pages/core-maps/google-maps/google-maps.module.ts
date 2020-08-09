import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsRoutingModule } from './google-maps-routing.module';
import { GoogleMapsComponent } from './google-maps.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    GoogleMapsRoutingModule,
   ThemeSharedModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCE0nvTeHBsiQIrbpMVTe489_O5mwyqofk'})
  ],
  declarations: [GoogleMapsComponent]
})
export class GoogleMapsModule { }

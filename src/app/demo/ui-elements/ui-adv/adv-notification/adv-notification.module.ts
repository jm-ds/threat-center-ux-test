import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvNotificationRoutingModule } from './adv-notification-routing.module';
import { AdvNotificationComponent } from './adv-notification.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {ToastyModule} from 'ng2-toasty';

@NgModule({
  imports: [
    CommonModule,
    AdvNotificationRoutingModule,
   ThemeSharedModule,
    ToastyModule.forRoot()
  ],
  declarations: [AdvNotificationComponent]
})
export class AdvNotificationModule { }

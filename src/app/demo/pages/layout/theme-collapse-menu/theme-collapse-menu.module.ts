import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeCollapseMenuRoutingModule } from './theme-collapse-menu-routing.module';
import { ThemeCollapseMenuComponent } from './theme-collapse-menu.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';
import {CommonContentModule} from '../common-content/common-content.module';

@NgModule({
  declarations: [ThemeCollapseMenuComponent],
  imports: [
    CommonModule,
    ThemeCollapseMenuRoutingModule,
   ThemeSharedModule,
    CommonContentModule
  ]
})
export class ThemeCollapseMenuModule { }

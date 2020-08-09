import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonContentComponent} from './common-content.component';
import {ThemeSharedModule} from '../../../../theme/shared/theme-shared.module';

@NgModule({
  declarations: [CommonContentComponent],
  exports: [CommonContentComponent],
  imports: [
    CommonModule,
   ThemeSharedModule,
  ]
})
export class CommonContentModule { }

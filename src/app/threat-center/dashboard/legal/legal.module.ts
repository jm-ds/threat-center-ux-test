import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';
import {ThemeSharedModule} from '../../../theme/shared/theme-shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPopoverModule, NgbProgressbarModule,NgbTabsetModule,NgbDropdownModule,NgbButtonsModule,NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LegalRoutingModule,
    ThemeSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbPopoverModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    SharedModule
  ],
  declarations: [
    LegalComponent,
  ]
})
export class LegalModule { }

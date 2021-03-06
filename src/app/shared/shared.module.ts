import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisableIfUnauthorizedDirective} from '@app/security/disable-if-unauthorized.directive';
import { HideIfUnauthorizedDirective} from '@app/security/hide-if-unauthorized.directive';
import {RemoveIfUnauthorizedDirective} from "@app/security/remove-if-unauthorized.directive";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DisableIfUnauthorizedDirective,
    HideIfUnauthorizedDirective,
    RemoveIfUnauthorizedDirective
  ],
  declarations: [
    DisableIfUnauthorizedDirective,
    HideIfUnauthorizedDirective,
    RemoveIfUnauthorizedDirective
  ],
  providers: []
})
export class SharedModule { }

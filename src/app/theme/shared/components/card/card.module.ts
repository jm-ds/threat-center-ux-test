import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbTooltipModule,
  ],
  declarations: [CardComponent],
  exports: [CardComponent]
})
export class CardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@app/shared/shared.module";
import { EntityRoutingModule } from './entity-routing.module';
import { EntityManageComponent } from './entity-manage/entity-manage.component';
import { ThemeSharedModule } from '@app/theme/shared/theme-shared.module';

import { TreeModule } from 'angular-tree-component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EntityManageComponent],
  imports: [
    CommonModule,
    ThemeSharedModule,
    EntityRoutingModule,
    SharedModule,
    TreeModule.forRoot(),
    FormsModule
  ],
  providers: []
})
export class EntityModule { }

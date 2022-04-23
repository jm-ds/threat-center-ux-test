import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@app/shared/shared.module";
import { EntityRoutingModule } from './entity-routing.module';
import { EntityManageComponent } from './entity-manage/entity-manage.component';
import { ThemeSharedModule } from '@app/theme/shared/theme-shared.module';
import { TreeModule } from '@circlon/angular-tree-component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChildEntityManageComponent } from './entity-manage/child-entity/child-manage.component';


@NgModule({
  declarations: [EntityManageComponent, ChildEntityManageComponent],
  imports: [
    CommonModule,
    ThemeSharedModule,
    EntityRoutingModule,
    SharedModule,
    TreeModule,
    FormsModule,
    NgbModule
  ]
})
export class EntityModule { }

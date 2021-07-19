import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { UserModule } from './user/user.module';
import { RbacModule } from './rbac/rbac.module';
import { EntityModule } from './entity/entity.module';
import { IntegrationModule } from './integration/integration.module';
import { InviteModule } from './invite/invite.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UserModule,
    RbacModule,
    EntityModule,
    IntegrationModule,
    InviteModule
  ]
})
export class AdminModule { }

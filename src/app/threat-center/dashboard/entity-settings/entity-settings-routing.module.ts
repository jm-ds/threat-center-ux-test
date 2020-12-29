import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntitySettingsComponent } from './setting/entity-settings.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: EntitySettingsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EntitySettingRoutingModule {
}

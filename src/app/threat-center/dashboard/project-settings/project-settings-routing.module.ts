import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectSettingsComponent } from './setting/project-settings.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ProjectSettingsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectSettingRoutingModule {
}

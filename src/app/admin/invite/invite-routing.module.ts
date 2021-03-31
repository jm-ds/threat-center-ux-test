import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { InviteShowComponent } from './invite-show/invite-show.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'show/:inviteHash',
                component: InviteShowComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InviteRoutingModule {
}

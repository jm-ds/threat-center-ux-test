import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent} from './container.component';
import { FileViewComponent } from '../../shared/file-view/file-view.component';
import { DiffViewComponent } from '../../shared/diff-view/diff-view.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent
  },
  {
    path: 'fileview',
    component: FileViewComponent
  },
  {
    path: 'diffview',
    component: DiffViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule { }

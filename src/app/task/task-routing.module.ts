import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';

const routes: Routes = [{
  path: '',
  component: LayoutPageComponent,
  children: [{
    path: 'list',
    component: ListPageComponent
  },
  {
    path: 'user-edit',
    component: UserEditComponent
  },
  {
    path: '**',
    redirectTo: 'list'
  }
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }

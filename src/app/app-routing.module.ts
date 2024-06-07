import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './task/pages/layout-page/layout-page.component';
import { ListPageComponent } from './task/pages/list-page/list-page.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { PublicGuard } from './auth/guards/public.guard';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [PublicGuard],
    canMatch: [PublicGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
    canActivate: [AuthGuard],
    canMatch: [AuthGuard]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

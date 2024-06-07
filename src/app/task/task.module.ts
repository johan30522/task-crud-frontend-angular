import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { TaskEditPageComponent } from './pages/task-edit-page/task-edit-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { TaskPageComponent } from './pages/task-page/task-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploaderImageComponent } from './components/uploader-image/uploader-image.component';
import { UploaderImageCropperComponent } from './components/uploader-image-cropper/uploader-image-cropper.component';


@NgModule({
  declarations: [
    ListPageComponent,
    LayoutPageComponent,
    TaskPageComponent,
    SidebarComponent,
    UserEditComponent,
    UploaderImageComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule,
 
  ]
})
export class TaskModule { }

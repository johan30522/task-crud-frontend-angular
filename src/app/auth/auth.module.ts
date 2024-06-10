import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestMaskComponent } from './components/test-mask/test-mask.component';
import { IMaskModule } from 'angular-imask';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserTaskWizardComponent } from './components/user-task-wizard/user-task-wizard.component';

@NgModule({
  declarations: [
    LoginPageComponent,
             RegisterPageComponent,
             LayoutPageComponent,
             TestMaskComponent,
             UserTaskWizardComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    IMaskModule,
    NgxSliderModule 
  ],
  providers: [],
})
export class AuthModule { }

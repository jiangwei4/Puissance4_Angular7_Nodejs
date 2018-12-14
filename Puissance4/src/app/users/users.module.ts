import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, SubscriptionComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    LoginComponent
  ]
})
export class UsersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnilyserLoginPageRoutingModule } from './enilyser-login-routing.module';

import { EnilyserLoginPage } from './enilyser-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnilyserLoginPageRoutingModule
  ],
  declarations: [EnilyserLoginPage]
})
export class EnilyserLoginPageModule {}

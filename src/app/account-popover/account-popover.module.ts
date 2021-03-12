import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPopoverPageRoutingModule } from './account-popover-routing.module';

import { AccountPopoverPage } from './account-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPopoverPageRoutingModule
  ],
  declarations: [AccountPopoverPage]
})
export class AccountPopoverPageModule {}

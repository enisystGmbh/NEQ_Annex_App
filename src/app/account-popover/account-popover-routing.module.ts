import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPopoverPage } from './account-popover.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPopoverPageRoutingModule {}

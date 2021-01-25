import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnilyserLoginPage } from './enilyser-login.page';

const routes: Routes = [
  {
    path: '',
    component: EnilyserLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnilyserLoginPageRoutingModule {}

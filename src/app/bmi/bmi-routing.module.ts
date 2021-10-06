import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BmiPage } from './bmi.page';

const routes: Routes = [
  {
    path: '',
    component: BmiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BmiPageRoutingModule {}

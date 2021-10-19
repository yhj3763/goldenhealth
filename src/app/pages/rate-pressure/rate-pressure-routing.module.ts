import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RatePressurePage } from './rate-pressure.page'

const routes: Routes = [
  {
    path: '',
    component: RatePressurePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatePressurePageRoutingModule {}

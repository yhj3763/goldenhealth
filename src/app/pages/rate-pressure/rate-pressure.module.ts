import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RatePressurePageRoutingModule } from './rate-pressure-routing.module';

import { RatePressurePage } from './rate-pressure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatePressurePageRoutingModule
  ],
  declarations: [RatePressurePage]
})
export class RatePressurePageModule {}

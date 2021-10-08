import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietPageRoutingModule } from './diet-routing.module';
import { LoginPage } from '../../login/login.page';

import { DietPage } from './diet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DietPageRoutingModule
  ],
  declarations: [DietPage],
    providers: [LoginPage]

})
export class DietPageModule {}

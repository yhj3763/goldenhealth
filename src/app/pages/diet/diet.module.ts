import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DietPageRoutingModule } from './diet-routing.module';
import { LoginPage } from '../../login/login.page';

import { DietPage } from './diet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DietPageRoutingModule
  ],
  declarations: [DietPage],
    providers: [LoginPage]

})
export class DietPageModule {}

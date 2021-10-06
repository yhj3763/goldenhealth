import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'bmi',
    loadChildren: () => import('./pages/bmi/bmi.module').then( m => m.BmiPageModule)
  },
  {
    path: 'rate-pressure',
    loadChildren: () => import('./pages/rate-pressure/rate-pressure.module').then( m => m.RatePressurePageModule)
  },
  {
    path: 'activity',
    loadChildren: () => import('./pages/activity/activity.module').then( m => m.ActivityPageModule)
  },
  {
    path: 'diet',
    loadChildren: () => import('./pages/diet/diet.module').then( m => m.DietPageModule)
  },
  //Jackie added for login signup 
  {
    path: 'signup',//canredirect to signup
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: '',//redirect back to login // removeable if is useless
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login',//redirect back to login // removeable if is useless
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

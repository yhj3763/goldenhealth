import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
    path: 'sleep',
    loadChildren: () => import('./pages/sleep/sleep.module').then( m => m.SleepPageModule)
  },
  {
    path: 'activity',
    loadChildren: () => import('./pages/activity/activity.module').then( m => m.ActivityPageModule)
  },
  {
    path: 'diet',
    loadChildren: () => import('./pages/diet/diet.module').then( m => m.DietPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

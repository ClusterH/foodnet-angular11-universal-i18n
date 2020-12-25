import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';

import { RestaurantListComponent } from './pages/restaurant-list.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: RestaurantListComponent
  },
  { path: ':restaurantname', loadChildren: () => import('./pages/restaurant-profile/restaurant-profile.module').then(m => m.RestaurantProfileModule) }

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
})
export class RestaurantListRoutingModule { }

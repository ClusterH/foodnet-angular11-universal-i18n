import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';

import { RestaurantListComponent } from './pages/restaurant-list.component';
import { RestaurantProfileComponent } from './pages/restaurant-profile/pages/restaurant-profile.component';

const routes: Routes = [
  { path: '', component: RestaurantListComponent },
  { path: ':restaurant', component: RestaurantProfileComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
})
export class RestaurantListRoutingModule { }

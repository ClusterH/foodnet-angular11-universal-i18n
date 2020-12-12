import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';

import { RestaurantFilterComponent } from './pages/restaurant-filter.component';

const routes: Routes = [
  { path: '**', component: RestaurantFilterComponent },
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
})
export class RestaurantFilterRoutingModule { }

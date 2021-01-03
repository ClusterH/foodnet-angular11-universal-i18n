import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantProfileComponent } from './pages/restaurant-profile.component';
import { RestaurantOrderComponent } from './components/restaurant-order/restaurant-order.component';
import { RestaurantSuccessComponent } from './components/restaurant-success/restaurant-success.component';

const routes: Routes = [
  {
    path: '', component: RestaurantProfileComponent
  },
  {
    path: 'order', component: RestaurantOrderComponent
  },
  {
    path: 'success', component: RestaurantSuccessComponent
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
})
export class RestaurantProfileRoutingModule { }

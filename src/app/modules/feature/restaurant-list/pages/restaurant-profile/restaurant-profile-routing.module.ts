import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantProfileComponent } from './pages/restaurant-profile.component';

const routes: Routes = [
  {
    path: '', component: RestaurantProfileComponent
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

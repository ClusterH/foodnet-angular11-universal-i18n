import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantProfileRoutingModule } from './restaurant-profile-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/modules/shared/shared.module';
import { RestaurantProfileComponent } from './pages/restaurant-profile.component';
import { RestaurantMenuComponent } from './components/restaurant-menu/restaurant-menu.component';
import { RestaurantInfoComponent } from './components/restaurant-info/restaurant-info.component';
import { RestaurantEvaluationComponent } from './components/restaurant-evaluation/restaurant-evaluation.component';

@NgModule({
  declarations: [
    RestaurantProfileComponent,
    RestaurantMenuComponent,
    RestaurantInfoComponent,
    RestaurantEvaluationComponent,
  ],
  imports: [
    CommonModule,
    RestaurantProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShareModule
  ],
  exports: [
  ]
})
export class RestaurantProfileModule { }

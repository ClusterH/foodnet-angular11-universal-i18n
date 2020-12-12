import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantFilterRoutingModule } from './restaurant-filter-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/modules/shared/shared.module';
import { RestaurantFilterComponent } from './pages/restaurant-filter.component';
import { FilterSectionComponent } from './components/filter-section/filter-section.component';

@NgModule({
  declarations: [
    RestaurantFilterComponent,
    FilterSectionComponent,
  ],
  imports: [
    CommonModule,
    RestaurantFilterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShareModule
  ],
  exports: [
  ]
})
export class RestaurantFilterModule { }

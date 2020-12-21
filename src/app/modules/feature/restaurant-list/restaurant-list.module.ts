import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantListRoutingModule } from './restaurant-list-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/modules/shared/shared.module';
import { RestaurantListComponent } from './pages/restaurant-list.component';
import { FilterSectionComponent } from './components/filter-section/filter-section.component';
import { RestaurantFilterService } from './services';

@NgModule({
  declarations: [
    RestaurantListComponent,
    FilterSectionComponent,
  ],
  imports: [
    CommonModule,
    RestaurantListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShareModule
  ],
  exports: [
  ],
  providers: [RestaurantFilterService]
})
export class RestaurantListModule { }

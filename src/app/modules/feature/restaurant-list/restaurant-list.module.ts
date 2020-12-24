import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantListRoutingModule } from './restaurant-list-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/modules/shared/shared.module';
import { RestaurantListComponent } from './pages/restaurant-list.component';
import { FilterSectionComponent } from './components/filter-section/filter-section.component';
import { RestaurantProfileComponent } from './pages/restaurant-profile/pages/restaurant-profile.component';
import { RestaurantMenuComponent } from './components/restaurant-menu/restaurant-menu.component';
import { RestaurantInfoComponent } from './components/restaurant-info/restaurant-info.component';
import { RestaurantEvaluationComponent } from './components/restaurant-evaluation/restaurant-evaluation.component';
import { RestaurantFilterService, RestaurantMenuService, RestaurantInfoService, RestaurantReviewService } from './services';

@NgModule({
  declarations: [
    RestaurantListComponent,
    FilterSectionComponent,
    RestaurantProfileComponent,
    RestaurantMenuComponent,
    RestaurantInfoComponent,
    RestaurantEvaluationComponent,
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
  providers: [RestaurantFilterService, RestaurantMenuService, RestaurantInfoService, RestaurantReviewService]
})
export class RestaurantListModule { }

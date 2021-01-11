import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantProfileRoutingModule } from './restaurant-profile-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestaurantProfileComponent } from './pages/restaurant-profile.component';
import { RestaurantMenuComponent } from './components/restaurant-menu/restaurant-menu.component';
import { RestaurantInfoComponent } from './components/restaurant-info/restaurant-info.component';
import { RestaurantEvaluationComponent } from './components/restaurant-evaluation/restaurant-evaluation.component';
import { RestaurantMenuService, RestaurantInfoService, RestaurantReviewService, RestaurantOrderService } from './services';
import { DeliveryAddressService } from 'src/app/modules/feature/profile/services';
import { ShareModule } from 'src/app/modules/shared/shared.module';
import { RestaurantOrderComponent } from './components/restaurant-order/restaurant-order.component';
import { RestaurantSuccessComponent } from './components/restaurant-success/restaurant-success.component';
import { RestaurantOrderListComponent } from './components/restaurant-order/components/restaurant-order-list/restaurant-order-list.component';
import { RestaurantOrderDeliveryLoginComponent } from './components/restaurant-order/components/restaurant-order-delivery-login/restaurant-order-delivery-login.component';
import { RestaurantOrderDeliveryLogoutComponent } from './components/restaurant-order/components/restaurant-order-delivery-logout/restaurant-order-delivery-logout.component';
import { RestaurantOrderNoDeliveryListComponent } from './components/restaurant-order/components/restaurant-order-no-delivery-list/restaurant-order-no-delivery-list.component';
import { RestaurantOrderPaymentComponent } from './components/restaurant-order/components/restaurant-order-payment/restaurant-order-payment.component';
import { MinOrderPipe } from './pipes/min-order.pipe';

@NgModule({
  declarations: [
    RestaurantProfileComponent,
    RestaurantMenuComponent,
    RestaurantInfoComponent,
    RestaurantEvaluationComponent,
    RestaurantOrderComponent,
    RestaurantSuccessComponent,
    RestaurantOrderListComponent,
    RestaurantOrderDeliveryLoginComponent,
    RestaurantOrderDeliveryLogoutComponent,
    RestaurantOrderNoDeliveryListComponent,
    RestaurantOrderPaymentComponent,
    MinOrderPipe,
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
  ],
  providers: [RestaurantMenuService, RestaurantInfoService, RestaurantReviewService, RestaurantOrderService, DeliveryAddressService]
})
export class RestaurantProfileModule { }

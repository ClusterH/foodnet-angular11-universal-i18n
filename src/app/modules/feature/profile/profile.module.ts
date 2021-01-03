import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShareModule } from 'src/app/modules/shared/shared.module';

import { ProfileComponent } from './profile.component';
import { ProfileMenulistComponent } from './components/profile-menulist/profile-menulist.component';
import { DeleteProfileComponent } from './pages/delete-profile/delete-profile.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { DeliveryListComponent } from './pages/delivery-list/delivery-list.component';
import { DeliveryEditComponent } from './pages/delivery-edit/delivery-edit.component';
import { ReviewListComponent } from './pages/review-list/review-list.component';
import { ReviewEditComponent } from './pages/review-edit/review-edit.component';
import { ReviewCreateComponent } from './pages/review-create/review-create.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DeleteProfileComponent,
    UpdateProfileComponent,
    ProfileMenulistComponent,
    ChangePasswordComponent,
    DeliveryListComponent,
    DeliveryEditComponent,
    ReviewListComponent,
    ReviewEditComponent,
    ReviewCreateComponent,
    OrderListComponent,
    OrderDetailComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ShareModule
  ],
  exports: [
    ProfileMenulistComponent
  ]
})
export class ProfileModule { }
